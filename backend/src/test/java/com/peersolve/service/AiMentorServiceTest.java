package com.peersolve.service;

import java.util.List;
import com.peersolve.model.BossStage;
import com.peersolve.model.Difficulty;
import com.peersolve.model.MisconceptionRule;
import com.peersolve.model.Mission;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class AiMentorServiceTest {

    private AiMentorService mentorService;

    @BeforeEach
    void setUp() {
        mentorService = new AiMentorService();
    }

    @Test
    void testAnalyzeAttempt_Solved() {
        Mission m = new Mission();
        m.setExpectedTimeComplexity("O(n)");
        var feedback = mentorService.analyzeAttempt(m, "int x = 0;", true, "", 0);
        assertEquals("CHALLENGE_SOLVED", feedback.diagnosis());
        assertEquals("TRIUMPHANT", feedback.tone());
        assertTrue(feedback.message().contains("zero hints"));
    }

    @Test
    void testAnalyzeAttempt_MisconceptionRuleMatch() {
        Mission m = new Mission();
        m.setExpectedTimeComplexity("O(n)");
        m.setMisconceptionRules(List.of(
            new MisconceptionRule("r1", "for[\\s\\S]*for", "Nested loop detected!", "Use a map")
        ));
        String code = "for(int i=0;i<n;i++) { for(int j=i+1;j<n;j++) {} }";
        var feedback = mentorService.analyzeAttempt(m, code, false, "", 1);
        assertEquals("MISCONCEPTION_DETECTED", feedback.diagnosis());
        assertEquals("Nested loop detected!", feedback.message());
    }

    @Test
    void testProgressiveHints() {
        Mission m = new Mission();
        m.setHints(List.of("Nudge", "Clue", "Blueprint"));
        String h1 = mentorService.getProgressiveHint(m, 1);
        String h2 = mentorService.getProgressiveHint(m, 2);
        String h3 = mentorService.getProgressiveHint(m, 3);
        assertTrue(h1.contains("Tier 1 Conceptual Nudge"));
        assertTrue(h2.contains("Tier 2 Algorithmic Clue"));
        assertTrue(h3.contains("Tier 3 Tactical Blueprint"));
    }

    @Test
    void testEvaluateExplanation() {
        BossStage s = new BossStage();
        s.setExpectedKeywords(List.of("time", "space", "hashmap", "o(n)"));
        var result = mentorService.evaluateExplanation(s, "By using a hashmap we achieve O(n) time complexity while trading extra space.");
        assertTrue(result.passed());
        assertTrue(result.score() >= 60);
    }
}
