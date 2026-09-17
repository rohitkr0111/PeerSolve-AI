package com.peersolve.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("missions")
public class Mission {
    @Id
    private String id;
    private String worldId;
    private String skillId;
    private String title;
    private String story;
    private String objective;
    private String challengeType; // CODE, DEBUG, OPTIMIZE
    private Difficulty difficulty;
    private String problemId;
    private String starterCode;
    private String expectedTimeComplexity;
    private String expectedSpaceComplexity;
    private List<ProblemExample> examples;
    private List<String> constraints;
    private List<TestCase> testCases;
    private List<String> hints; // 3 progressive tiers
    private List<MisconceptionRule> misconceptionRules;
    private String conceptExplanation;
    private int xpReward;
    private int order;

    public Mission() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorldId() { return worldId; }
    public void setWorldId(String worldId) { this.worldId = worldId; }
    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getStory() { return story; }
    public void setStory(String story) { this.story = story; }
    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }
    public String getChallengeType() { return challengeType; }
    public void setChallengeType(String challengeType) { this.challengeType = challengeType; }
    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }
    public String getProblemId() { return problemId; }
    public void setProblemId(String problemId) { this.problemId = problemId; }
    public String getStarterCode() { return starterCode; }
    public void setStarterCode(String starterCode) { this.starterCode = starterCode; }
    public String getExpectedTimeComplexity() { return expectedTimeComplexity; }
    public void setExpectedTimeComplexity(String expectedTimeComplexity) { this.expectedTimeComplexity = expectedTimeComplexity; }
    public String getExpectedSpaceComplexity() { return expectedSpaceComplexity; }
    public void setExpectedSpaceComplexity(String expectedSpaceComplexity) { this.expectedSpaceComplexity = expectedSpaceComplexity; }
    public List<ProblemExample> getExamples() { return examples; }
    public void setExamples(List<ProblemExample> examples) { this.examples = examples; }
    public List<String> getConstraints() { return constraints; }
    public void setConstraints(List<String> constraints) { this.constraints = constraints; }
    public List<TestCase> getTestCases() { return testCases; }
    public void setTestCases(List<TestCase> testCases) { this.testCases = testCases; }
    public List<String> getHints() { return hints; }
    public void setHints(List<String> hints) { this.hints = hints; }
    public List<MisconceptionRule> getMisconceptionRules() { return misconceptionRules; }
    public void setMisconceptionRules(List<MisconceptionRule> misconceptionRules) { this.misconceptionRules = misconceptionRules; }
    public String getConceptExplanation() { return conceptExplanation; }
    public void setConceptExplanation(String conceptExplanation) { this.conceptExplanation = conceptExplanation; }
    public int getXpReward() { return xpReward; }
    public void setXpReward(int xpReward) { this.xpReward = xpReward; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
}
