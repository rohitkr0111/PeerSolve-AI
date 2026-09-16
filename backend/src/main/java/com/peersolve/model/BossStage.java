package com.peersolve.model;

import java.util.List;

public class BossStage {
    private int stageNumber;
    private String stageType; // DIAGNOSE, FIX, OPTIMIZE, EXPLAIN
    private String title;
    private String instructions;
    private String dialogue; // Boss taunt
    private String buggyCode;
    private List<String> diagnoseOptions;
    private Integer correctOptionIndex;
    private String starterCode;
    private List<TestCase> testCases;
    private List<String> expectedKeywords; // for EXPLAIN stage
    private String mentorHint;
    private int stageXp;

    public BossStage() {}

    public int getStageNumber() { return stageNumber; }
    public void setStageNumber(int stageNumber) { this.stageNumber = stageNumber; }
    public String getStageType() { return stageType; }
    public void setStageType(String stageType) { this.stageType = stageType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public String getDialogue() { return dialogue; }
    public void setDialogue(String dialogue) { this.dialogue = dialogue; }
    public String getBuggyCode() { return buggyCode; }
    public void setBuggyCode(String buggyCode) { this.buggyCode = buggyCode; }
    public List<String> getDiagnoseOptions() { return diagnoseOptions; }
    public void setDiagnoseOptions(List<String> diagnoseOptions) { this.diagnoseOptions = diagnoseOptions; }
    public Integer getCorrectOptionIndex() { return correctOptionIndex; }
    public void setCorrectOptionIndex(Integer correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }
    public String getStarterCode() { return starterCode; }
    public void setStarterCode(String starterCode) { this.starterCode = starterCode; }
    public List<TestCase> getTestCases() { return testCases; }
    public void setTestCases(List<TestCase> testCases) { this.testCases = testCases; }
    public List<String> getExpectedKeywords() { return expectedKeywords; }
    public void setExpectedKeywords(List<String> expectedKeywords) { this.expectedKeywords = expectedKeywords; }
    public String getMentorHint() { return mentorHint; }
    public void setMentorHint(String mentorHint) { this.mentorHint = mentorHint; }
    public int getStageXp() { return stageXp; }
    public void setStageXp(int stageXp) { this.stageXp = stageXp; }
}
