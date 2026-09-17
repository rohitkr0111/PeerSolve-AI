package com.peersolve.service;

import java.util.*;
import java.util.regex.Pattern;
import com.peersolve.model.*;
import org.springframework.stereotype.Service;

@Service
public class AiMentorService {

    public record MentorFeedback(
        String mentorName,
        String mentorAvatar,
        String diagnosis,
        String message,
        String suggestedAction,
        String tone // ENCOURAGING, ALERT, TRIUMPHANT, ANALYTICAL
    ) {}

    public record ExplanationEvaluation(
        boolean passed,
        int score, // 0 to 100
        String feedback,
        List<String> detectedConcepts,
        List<String> missingConcepts
    ) {}

    public record AdaptiveRecommendation(
        String missionId,
        String title,
        String worldId,
        String reason,
        String difficulty
    ) {}

    public MentorFeedback analyzeAttempt(Mission mission, String code, boolean passed, String executionMessage, int hintsUsed) {
        String mentorName = "ADA-7 // Tactician AI";
        String avatar = "bot-mentor";

        if (passed) {
            String note = "Outstanding execution! Your solution satisfied all security parameters with " +
                    mission.getExpectedTimeComplexity() + " time efficiency.";
            if (hintsUsed == 0) {
                note += " Flawless run with zero hints used — maximum XP multiplier applied!";
            }
            return new MentorFeedback(
                mentorName,
                avatar,
                "CHALLENGE_SOLVED",
                note,
                "Ready for the next sector node or boss challenge.",
                "TRIUMPHANT"
            );
        }

        // 1. Check for specific mission misconception rules
        if (mission.getMisconceptionRules() != null) {
            for (MisconceptionRule rule : mission.getMisconceptionRules()) {
                if (rule.getPattern() != null && !rule.getPattern().isBlank()) {
                    try {
                        Pattern p = Pattern.compile(rule.getPattern(), Pattern.CASE_INSENSITIVE);
                        if (p.matcher(code).find()) {
                            return new MentorFeedback(
                                mentorName,
                                avatar,
                                "MISCONCEPTION_DETECTED",
                                rule.getMessage(),
                                rule.getSuggestedDirection(),
                                "ALERT"
                            );
                        }
                    } catch (Exception ignored) {}
                }
            }
        }

        // 2. Common general code pattern misconceptions
        // e.g. Nested for loops for Two Sum or Duplicate search
        if (containsNestedLoops(code) && "O(n)".equalsIgnoreCase(mission.getExpectedTimeComplexity())) {
            return new MentorFeedback(
                mentorName,
                avatar,
                "QUADRATIC_BOTTLENECK",
                "Sensors detect nested iterations (O(N²)). While logically sound on small inputs, this will overload system buffers on massive telemetry streams. Can you store values you've already seen in an auxiliary structure for O(1) checks?",
                "Consider replacing the inner loop with a HashMap or HashSet lookup.",
                "ANALYTICAL"
            );
        }

        // 3. Execution error analysis
        if (executionMessage != null && !executionMessage.isBlank()) {
            if (executionMessage.contains("ArrayIndexOutOfBoundsException")) {
                return new MentorFeedback(
                    mentorName,
                    avatar,
                    "INDEX_OUT_OF_BOUNDS",
                    "Index Drift Alert: Your pointer drifted past array boundaries. Remember that in Java, indices span 0 to length - 1.",
                    "Verify loop termination conditions: use < arr.length instead of <= arr.length.",
                    "ALERT"
                );
            }
            if (executionMessage.contains("NullPointerException")) {
                return new MentorFeedback(
                    mentorName,
                    avatar,
                    "NULL_DEREFERENCE",
                    "Null Collision: You attempted to access properties of an uninstantiated object or missing key.",
                    "Guard lookup results with null checks or use containsKey() before accessing.",
                    "ALERT"
                );
            }
            if (executionMessage.contains("StackOverflowError")) {
                return new MentorFeedback(
                    mentorName,
                    avatar,
                    "RECURSION_OVERFLOW",
                    "Infinite Recursion Vortex: The execution stack exhausted all available frames without hitting a terminating base condition.",
                    "Ensure your base case is explicitly tested at the beginning of the function.",
                    "ALERT"
                );
            }
            if (executionMessage.contains("error:") || executionMessage.contains("cannot find symbol")) {
                return new MentorFeedback(
                    mentorName,
                    avatar,
                    "SYNTAX_ANOMALY",
                    "Compilation Malfunction: Check variable spelling, semicolons, and imported collections (e.g. java.util.*).",
                    "Review the compiler output closely and verify types.",
                    "ALERT"
                );
            }
        }

        // Default failure guidance
        return new MentorFeedback(
            mentorName,
            avatar,
            "INCORRECT_OUTPUT",
            "Telemetry mismatch: Your output did not match expected ground-truth test vectors. Look at the failing test case input and trace variable states step by step.",
            "Inspect the first test case and use the Hint button if you need conceptual direction.",
            "ENCOURAGING"
        );
    }

    public String getProgressiveHint(Mission mission, int currentHintTier) {
        if (mission.getHints() == null || mission.getHints().isEmpty()) {
            return "Analyze the problem constraints and test the edge cases.";
        }
        int index = Math.min(Math.max(0, currentHintTier - 1), mission.getHints().size() - 1);
        String prefix = switch (index) {
            case 0 -> "💡 [Tier 1 Conceptual Nudge] ";
            case 1 -> "🧭 [Tier 2 Algorithmic Clue] ";
            default -> "🛠️ [Tier 3 Tactical Blueprint] ";
        };
        return prefix + mission.getHints().get(index);
    }

    public ExplanationEvaluation evaluateExplanation(BossStage stage, String explanation) {
        if (explanation == null || explanation.trim().length() < 15) {
            return new ExplanationEvaluation(
                false,
                20,
                "Your tactical defense is too brief. Provide a thorough explanation of the algorithmic trade-offs (time vs space complexity).",
                List.of(),
                stage.getExpectedKeywords() != null ? stage.getExpectedKeywords() : List.of("time complexity", "O(n)", "space")
            );
        }

        String lower = explanation.toLowerCase();
        List<String> expected = stage.getExpectedKeywords() != null ? stage.getExpectedKeywords() :
                List.of("time", "complexity", "o(n)", "space", "hash", "linear", "constant", "tradeoff");

        List<String> detected = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String kw : expected) {
            if (lower.contains(kw.toLowerCase())) {
                detected.add(kw);
            } else {
                missing.add(kw);
            }
        }

        int score = Math.min(100, Math.max(30, (int) Math.round((detected.size() * 100.0) / Math.max(1, expected.size()))));
        if (explanation.length() > 60) score = Math.min(100, score + 15);

        boolean passed = score >= 60;
        String feedback;
        if (passed) {
            feedback = "Defense Approved! ADA-7 confirms sound conceptual mastery: " +
                    "You clearly articulated how the data structure optimizes time complexity from quadratic to linear by trading auxiliary space.";
        } else {
            feedback = "Incomplete Tactical Analysis: You must address core algorithmic factors. Explain the trade-off between time complexity and auxiliary space.";
        }

        return new ExplanationEvaluation(passed, score, feedback, detected, missing);
    }

    public AdaptiveRecommendation recommendNextChallenge(PlayerProfile profile, List<Mission> allMissions, List<BossBattle> bosses) {
        // 1. If any skill has mastery < 40 and there are uncompleted missions in that skill, prioritize it
        for (Map.Entry<String, Integer> entry : profile.getSkillMastery().entrySet()) {
            if (entry.getValue() < 40) {
                for (Mission m : allMissions) {
                    if (m.getSkillId().equalsIgnoreCase(entry.getKey()) && !profile.getCompletedMissions().contains(m.getId())) {
                        return new AdaptiveRecommendation(
                            m.getId(),
                            m.getTitle(),
                            m.getWorldId(),
                            "Skill mastery in " + entry.getKey() + " is currently " + entry.getValue() + "%. Fortify fundamentals here.",
                            m.getDifficulty().name()
                        );
                    }
                }
            }
        }

        // 2. Check if player has completed all missions in active world and hasn't defeated boss
        for (BossBattle b : bosses) {
            if (b.getWorldId().equalsIgnoreCase(profile.getActiveWorldId()) && !profile.getDefeatedBosses().contains(b.getId())) {
                long totalWorldMissions = allMissions.stream().filter(m -> m.getWorldId().equals(b.getWorldId())).count();
                long completedWorldMissions = allMissions.stream().filter(m -> m.getWorldId().equals(b.getWorldId()) && profile.getCompletedMissions().contains(m.getId())).count();
                if (completedWorldMissions >= totalWorldMissions && totalWorldMissions > 0) {
                    return new AdaptiveRecommendation(
                        b.getId(),
                        b.getTitle(),
                        b.getWorldId(),
                        "All sector nodes cleared! The Boss Guardian awaits your tactical challenge.",
                        "BOSS"
                    );
                }
            }
        }

        // 3. Find next uncompleted mission in active world
        for (Mission m : allMissions) {
            if (m.getWorldId().equalsIgnoreCase(profile.getActiveWorldId()) && !profile.getCompletedMissions().contains(m.getId())) {
                return new AdaptiveRecommendation(
                    m.getId(),
                    m.getTitle(),
                    m.getWorldId(),
                    "Next tactical objective in active sector.",
                    m.getDifficulty().name()
                );
            }
        }

        // 4. Any remaining uncompleted mission in any world
        for (Mission m : allMissions) {
            if (!profile.getCompletedMissions().contains(m.getId())) {
                return new AdaptiveRecommendation(
                    m.getId(),
                    m.getTitle(),
                    m.getWorldId(),
                    "Explore newly available training ground.",
                    m.getDifficulty().name()
                );
            }
        }

        // If everything completed:
        return new AdaptiveRecommendation(
            allMissions.isEmpty() ? "" : allMissions.get(0).getId(),
            "Master Arena",
            profile.getActiveWorldId(),
            "You have conquered current sectors! Replay challenges to set speed records and boost mastery.",
            "MASTERY"
        );
    }

    private boolean containsNestedLoops(String code) {
        int forCount = 0;
        int whileCount = 0;
        String[] lines = code.split("\\r?\\n");
        int depth = 0;
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith("for") || trimmed.contains(" for(") || trimmed.contains(" for (")) {
                forCount++;
                if (forCount >= 2 && depth > 0) return true;
                depth++;
            }
            if (trimmed.startsWith("while") || trimmed.contains(" while(") || trimmed.contains(" while (")) {
                whileCount++;
                if (whileCount >= 2 && depth > 0) return true;
                depth++;
            }
            if (trimmed.contains("}") && depth > 0) {
                depth--;
            }
        }
        return false;
    }
}
