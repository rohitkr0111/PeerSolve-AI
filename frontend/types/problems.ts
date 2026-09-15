export type Problem = { id:string; title:string; difficulty:"EASY"|"MEDIUM"|"HARD"; topics:string[] };
export type ProblemDetail = Problem & { description:string; examples:{input:string;output:string;explanation:string}[]; constraints:string[]; starterCode:string; expectedTimeComplexity:string; expectedSpaceComplexity:string };
export type TestCaseResult = { number:number; passed:boolean; status:string; output:string };
export type ExecutionResult = { status:string; testCasesPassed:number; totalTestCases:number; executionTime:number; memory:number; output:string; testCases:TestCaseResult[] };
export type Submission = { id:string; problemId:string; status:string; language:string; executionTime:number; memory:number; testCasesPassed:number; totalTestCases:number; createdAt:string; code?:string };
