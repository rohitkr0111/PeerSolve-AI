package com.peersolve.dto;

import java.util.List;

public class MentorRequestDto {
    private String problemId;
    private String missionId;
    private String code;
    private String question;
    private String executionStatus;
    private String executionMessage;
    private String failingTest;
    private Integer hintsUsed;
    private List<ChatMessage> conversationHistory;

    public static class ChatMessage {
        private String role; // "user" or "assistant"
        private String content;

        public ChatMessage() {}
        public ChatMessage(String role, String content) { this.role = role; this.content = content; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public String getProblemId() { return problemId; }
    public void setProblemId(String problemId) { this.problemId = problemId; }
    public String getMissionId() { return missionId; }
    public void setMissionId(String missionId) { this.missionId = missionId; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getExecutionStatus() { return executionStatus; }
    public void setExecutionStatus(String executionStatus) { this.executionStatus = executionStatus; }
    public String getExecutionMessage() { return executionMessage; }
    public void setExecutionMessage(String executionMessage) { this.executionMessage = executionMessage; }
    public String getFailingTest() { return failingTest; }
    public void setFailingTest(String failingTest) { this.failingTest = failingTest; }
    public Integer getHintsUsed() { return hintsUsed; }
    public void setHintsUsed(Integer hintsUsed) { this.hintsUsed = hintsUsed; }
    public List<ChatMessage> getConversationHistory() { return conversationHistory; }
    public void setConversationHistory(List<ChatMessage> conversationHistory) { this.conversationHistory = conversationHistory; }
}
