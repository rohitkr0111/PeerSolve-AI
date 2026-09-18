import * as Y from "yjs";
import type * as MonacoType from "monaco-editor";
import type { Awareness } from "y-protocols/awareness";

const createMutex = () => {
  let token = true;
  return (cb: () => void) => {
    if (token) {
      token = false;
      try {
        cb();
      } finally {
        token = true;
      }
    }
  };
};

class RelativeSelection {
  constructor(
    public start: Y.RelativePosition,
    public end: Y.RelativePosition,
    public direction: MonacoType.SelectionDirection
  ) {}
}

const createRelativeSelection = (
  editor: MonacoType.editor.IStandaloneCodeEditor,
  monacoModel: MonacoType.editor.ITextModel,
  type: Y.Text
) => {
  const sel = editor.getSelection();
  if (sel !== null) {
    const startPos = sel.getStartPosition();
    const endPos = sel.getEndPosition();
    const start = Y.createRelativePositionFromTypeIndex(type, monacoModel.getOffsetAt(startPos));
    const end = Y.createRelativePositionFromTypeIndex(type, monacoModel.getOffsetAt(endPos));
    return new RelativeSelection(start, end, sel.getDirection());
  }
  return null;
};

const createMonacoSelectionFromRelativeSelection = (
  monaco: typeof MonacoType,
  editor: MonacoType.editor.IStandaloneCodeEditor,
  type: Y.Text,
  relSel: RelativeSelection,
  doc: Y.Doc
) => {
  const start = Y.createAbsolutePositionFromRelativePosition(relSel.start, doc);
  const end = Y.createAbsolutePositionFromRelativePosition(relSel.end, doc);
  if (start !== null && end !== null && start.type === type && end.type === type) {
    const model = editor.getModel();
    if (!model) return null;
    const startPos = model.getPositionAt(start.index);
    const endPos = model.getPositionAt(end.index);
    return monaco.Selection.createWithDirection(
      startPos.lineNumber,
      startPos.column,
      endPos.lineNumber,
      endPos.column,
      relSel.direction
    );
  }
  return null;
};

export class MonacoBinding {
  private mux = createMutex();
  private _savedSelections = new Map<MonacoType.editor.IStandaloneCodeEditor, RelativeSelection>();
  private _decorations = new Map<MonacoType.editor.IStandaloneCodeEditor, string[]>();
  private _beforeTransaction: () => void;
  private _rerenderDecorations: () => void;
  private _ytextObserver: (event: Y.YTextEvent) => void;
  private _monacoChangeHandler: MonacoType.IDisposable;
  private _monacoDisposeHandler: MonacoType.IDisposable;

  constructor(
    public ytext: Y.Text,
    public monacoModel: MonacoType.editor.ITextModel,
    public editors: Set<MonacoType.editor.IStandaloneCodeEditor>,
    public awareness: Awareness | null,
    private monaco: typeof MonacoType
  ) {
    const doc = ytext.doc as Y.Doc;

    this._beforeTransaction = () => {
      this.mux(() => {
        this._savedSelections = new Map();
        editors.forEach((editor) => {
          if (editor.getModel() === monacoModel) {
            const rsel = createRelativeSelection(editor, monacoModel, ytext);
            if (rsel !== null) {
              this._savedSelections.set(editor, rsel);
            }
          }
        });
      });
    };
    doc.on("beforeAllTransactions", this._beforeTransaction);

    this._rerenderDecorations = () => {
      editors.forEach((editor) => {
        if (awareness && editor.getModel() === monacoModel) {
          const currentDecorations = this._decorations.get(editor) || [];
          const newDecorations: MonacoType.editor.IModelDeltaDecoration[] = [];

          awareness.getStates().forEach((state, clientID) => {
            if (
              clientID !== doc.clientID &&
              state.selection != null &&
              state.selection.anchor != null &&
              state.selection.head != null
            ) {
              const anchorAbs = Y.createAbsolutePositionFromRelativePosition(state.selection.anchor, doc);
              const headAbs = Y.createAbsolutePositionFromRelativePosition(state.selection.head, doc);

              if (anchorAbs !== null && headAbs !== null && anchorAbs.type === ytext && headAbs.type === ytext) {
                let start: MonacoType.Position;
                let end: MonacoType.Position;
                let afterContentClassName: string | null = null;
                let beforeContentClassName: string | null = null;

                if (anchorAbs.index < headAbs.index) {
                  start = monacoModel.getPositionAt(anchorAbs.index);
                  end = monacoModel.getPositionAt(headAbs.index);
                  afterContentClassName = "yRemoteSelectionHead yRemoteSelectionHead-" + clientID;
                } else {
                  start = monacoModel.getPositionAt(headAbs.index);
                  end = monacoModel.getPositionAt(anchorAbs.index);
                  beforeContentClassName = "yRemoteSelectionHead yRemoteSelectionHead-" + clientID;
                }

                newDecorations.push({
                  range: new this.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                  options: {
                    className: "yRemoteSelection yRemoteSelection-" + clientID,
                    afterContentClassName: afterContentClassName || undefined,
                    beforeContentClassName: beforeContentClassName || undefined,
                  },
                });
              }
            }
          });

          this._decorations.set(editor, editor.deltaDecorations(currentDecorations, newDecorations));
        } else {
          this._decorations.delete(editor);
        }
      });
    };

    this._ytextObserver = (event: Y.YTextEvent) => {
      this.mux(() => {
        let index = 0;
        event.delta.forEach((op) => {
          if (op.retain !== undefined) {
            index += op.retain;
          } else if (op.insert !== undefined) {
            const pos = monacoModel.getPositionAt(index);
            const range = new this.monaco.Selection(pos.lineNumber, pos.column, pos.lineNumber, pos.column);
            const insert = op.insert as string;
            monacoModel.applyEdits([{ range, text: insert }]);
            index += insert.length;
          } else if (op.delete !== undefined) {
            const pos = monacoModel.getPositionAt(index);
            const endPos = monacoModel.getPositionAt(index + op.delete);
            const range = new this.monaco.Selection(pos.lineNumber, pos.column, endPos.lineNumber, endPos.column);
            monacoModel.applyEdits([{ range, text: "" }]);
          }
        });

        this._savedSelections.forEach((rsel, editor) => {
          const sel = createMonacoSelectionFromRelativeSelection(this.monaco, editor, ytext, rsel, doc);
          if (sel !== null) {
            editor.setSelection(sel);
          }
        });
      });
      this._rerenderDecorations();
    };
    ytext.observe(this._ytextObserver);

    const ytextValue = ytext.toString();
    if (monacoModel.getValue() !== ytextValue) {
      monacoModel.setValue(ytextValue);
    }

    this._monacoChangeHandler = monacoModel.onDidChangeContent((event) => {
      this.mux(() => {
        doc.transact(() => {
          const sorted = [...event.changes].sort((a, b) => b.rangeOffset - a.rangeOffset);
          sorted.forEach((change) => {
            ytext.delete(change.rangeOffset, change.rangeLength);
            ytext.insert(change.rangeOffset, change.text);
          });
        }, this);
      });
    });

    this._monacoDisposeHandler = monacoModel.onWillDispose(() => {
      this.destroy();
    });

    if (awareness) {
      editors.forEach((editor) => {
        editor.onDidChangeCursorSelection(() => {
          if (editor.getModel() === monacoModel) {
            const sel = editor.getSelection();
            if (sel === null) return;
            let anchor = monacoModel.getOffsetAt(sel.getStartPosition());
            let head = monacoModel.getOffsetAt(sel.getEndPosition());
            if (sel.getDirection() === this.monaco.SelectionDirection.RTL) {
              const tmp = anchor;
              anchor = head;
              head = tmp;
            }
            awareness.setLocalStateField("selection", {
              anchor: Y.createRelativePositionFromTypeIndex(ytext, anchor),
              head: Y.createRelativePositionFromTypeIndex(ytext, head),
            });
          }
        });
      });
      awareness.on("change", this._rerenderDecorations);
    }
  }

  destroy() {
    this._monacoChangeHandler.dispose();
    this._monacoDisposeHandler.dispose();
    this.ytext.unobserve(this._ytextObserver);
    (this.ytext.doc as Y.Doc).off("beforeAllTransactions", this._beforeTransaction);
    if (this.awareness) {
      this.awareness.off("change", this._rerenderDecorations);
    }
  }
}
