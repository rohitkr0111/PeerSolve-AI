package com.peersolve.model;

public class MisconceptionRule {
    private String id;
    private String pattern; // regex or keyword signature
    private String message; // Mentor advice explaining the misconception
    private String suggestedDirection; // What to explore instead

    public MisconceptionRule() {}

    public MisconceptionRule(String id, String pattern, String message, String suggestedDirection) {
        this.id = id;
        this.pattern = pattern;
        this.message = message;
        this.suggestedDirection = suggestedDirection;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPattern() { return pattern; }
    public void setPattern(String pattern) { this.pattern = pattern; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getSuggestedDirection() { return suggestedDirection; }
    public void setSuggestedDirection(String suggestedDirection) { this.suggestedDirection = suggestedDirection; }
}
