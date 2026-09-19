package com.peersolve.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import com.peersolve.dto.*;
import com.peersolve.model.*;
import com.peersolve.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GameService {

    private final PlayerProfileRepository profileRepo;
    private final GameWorldRepository worldRepo;
    private final MissionRepository missionRepo;
    private final BossBattleRepository bossRepo;
    private final AchievementRepository achievementRepo;
    private final UserRepository userRepo;
    private final Judge0Service judgeService;
    private final AiMentorService mentorService;

    public GameService(
        PlayerProfileRepository profileRepo,
        GameWorldRepository worldRepo,
        MissionRepository missionRepo,
        BossBattleRepository bossRepo,
        AchievementRepository achievementRepo,
        UserRepository userRepo,
        Judge0Service judgeService,
        AiMentorService mentorService
    ) {
        this.profileRepo = profileRepo;
        this.worldRepo = worldRepo;
        this.missionRepo = missionRepo;
        this.bossRepo = bossRepo;
        this.achievementRepo = achievementRepo;
        this.userRepo = userRepo;
        this.judgeService = judgeService;
        this.mentorService = mentorService;
    }

    public PlayerProfile getOrCreateProfile(String userId) {
        return profileRepo.findByUserId(userId).orElseGet(() -> {
            String name = "Player";
            Optional<User> u = userRepo.findById(userId);
            if (u.isPresent()) name = u.get().getName();
            PlayerProfile p = new PlayerProfile(userId, name);
            return profileRepo.save(p);
        });
    }

    public PlayerProfileResponse getProfileResponse(String userId) {
        PlayerProfile p = getOrCreateProfile(userId);
        updateStreakIfNeeded(p);
        profileRepo.save(p);

        int xpForCurrent = (p.getLevel() - 1) * 300;
        int xpForNext = p.getLevel() * 300;

        return new PlayerProfileResponse(
            p.getId(),
            p.getUserId(),
            p.getUsername(),
            p.getXp(),
            p.getLevel(),
            p.getStreakDays(),
            p.getActiveWorldId(),
            p.getUnlockedSkills(),
            p.getCompletedMissions(),
            p.getDefeatedBosses(),
            p.getSkillMastery(),
            p.getUnlockedAchievements(),
            p.getTotalHintsUsed(),
            p.getTotalAttempts(),
            xpForCurrent,
            xpForNext
        );
    }

    public List<GameWorldResponse> getWorlds(String userId) {
        PlayerProfile profile = getOrCreateProfile(userId);
        List<GameWorld> worlds = worldRepo.findAllByOrderByOrderAsc();

        List<GameWorldResponse> result = new ArrayList<>();
        for (GameWorld w : worlds) {
            List<Mission> missions = missionRepo.findByWorldIdOrderByOrderAsc(w.getId());
            int completedCount = 0;
            List<MissionSummaryResponse> summaries = new ArrayList<>();

            boolean previousMissionDone = true;
            for (Mission m : missions) {
                boolean completed = profile.getCompletedMissions().contains(m.getId());
                if (completed) completedCount++;

                boolean unlocked = (w.getOrder() == 1 || profile.getLevel() >= w.getRequiredLevel())
                        && previousMissionDone;

                summaries.add(new MissionSummaryResponse(
                    m.getId(),
                    m.getWorldId(),
                    m.getSkillId(),
                    m.getTitle(),
                    m.getObjective(),
                    m.getDifficulty().name(),
                    m.getXpReward(),
                    m.getOrder(),
                    completed,
                    unlocked
                ));

                previousMissionDone = completed;
            }

            boolean worldUnlocked = profile.getLevel() >= w.getRequiredLevel();
            boolean bossDefeated = profile.getDefeatedBosses().contains(w.getBossBattleId());
            int percent = missions.isEmpty() ? 0 : (int) Math.round((completedCount * 100.0) / missions.size());

            result.add(new GameWorldResponse(
                w.getId(),
                w.getName(),
                w.getSubtitle(),
                w.getDescription(),
                w.getTheme(),
                w.getOrder(),
                w.getRequiredLevel(),
                worldUnlocked,
                completedCount,
                missions.size(),
                percent,
                bossDefeated,
                w.getBossBattleId(),
                summaries,
                w.getBadgeIcon()
            ));
        }

        return result;
    }

    public MissionDetailResponse getMission(String missionId, String userId) {
        Mission m = missionRepo.findById(missionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mission not found: " + missionId));

        PlayerProfile profile = getOrCreateProfile(userId);
        boolean completed = profile.getCompletedMissions().contains(missionId);

        // Provide sample test cases for user testing
        List<TestCase> sampleTests = m.getTestCases() != null ? m.getTestCases() : List.of();

        return new MissionDetailResponse(
            m.getId(),
            m.getWorldId(),
            m.getSkillId(),
            m.getTitle(),
            m.getStory(),
            m.getObjective(),
            m.getChallengeType(),
            m.getDifficulty(),
            m.getStarterCode(),
            m.getExpectedTimeComplexity(),
            m.getExpectedSpaceComplexity(),
            m.getExamples(),
            m.getConstraints(),
            sampleTests,
            m.getHints() != null ? m.getHints().size() : 0,
            m.getXpReward(),
            completed,
            m.getOrder()
        );
    }

    public MissionAttemptResponse attemptMission(String userId, String missionId, MissionAttemptRequest request) {
        Mission mission = missionRepo.findById(missionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mission not found: " + missionId));

        PlayerProfile profile = getOrCreateProfile(userId);
        profile.setTotalAttempts(profile.getTotalAttempts() + 1);

        // Run code against mission test cases
        List<TestCaseResult> results = new ArrayList<>();
        int passedCount = 0;
        long totalTime = 0;
        long maxMemory = 0;
        String executionMessage = "";
        SubmissionStatus overallStatus = SubmissionStatus.ACCEPTED;

        int index = 1;
        for (TestCase tc : mission.getTestCases()) {
            Judge0Service.JudgeResult jr = judgeService.execute(request.code(), tc);
            boolean ok = jr.status() == SubmissionStatus.ACCEPTED;
            if (ok) {
                passedCount++;
            } else if (overallStatus == SubmissionStatus.ACCEPTED) {
                overallStatus = jr.status();
            }
            totalTime += jr.executionTime();
            maxMemory = Math.max(maxMemory, jr.memory());
            executionMessage = jr.message();
            results.add(new TestCaseResult(index++, ok, jr.description(), jr.message()));
        }

        boolean allPassed = passedCount == mission.getTestCases().size();
        AiMentorService.MentorFeedback feedback = mentorService.analyzeAttempt(
            mission,
            request.code(),
            allPassed,
            executionMessage,
            request.hintsUsed()
        );

        int xpEarned = 0;
        boolean leveledUp = false;
        List<String> newAchievements = new ArrayList<>();
        String nextMissionId = null;

        if (allPassed) {
            boolean wasAlreadyCompleted = profile.getCompletedMissions().contains(missionId);
            if (!wasAlreadyCompleted) {
                profile.getCompletedMissions().add(missionId);
                // Calculate XP
                double multiplier = Math.max(0.4, 1.0 - (request.hintsUsed() * 0.2));
                xpEarned = (int) Math.round(mission.getXpReward() * multiplier);

                int oldLevel = profile.getLevel();
                profile.setXp(profile.getXp() + xpEarned);
                int newLevel = 1 + (profile.getXp() / 300);
                if (newLevel > oldLevel) {
                    profile.setLevel(newLevel);
                    leveledUp = true;
                }

                // Increase mastery for this skill
                String skill = mission.getSkillId();
                int currentMastery = profile.getSkillMastery().getOrDefault(skill, 10);
                int updatedMastery = Math.min(100, currentMastery + 15);
                profile.getSkillMastery().put(skill, updatedMastery);

                // Achievements check
                checkAndUnlockAchievement(profile, "FIRST_MISSION", newAchievements);
                if (request.hintsUsed() == 0) {
                    checkAndUnlockAchievement(profile, "HINTLESS_SOLVER", newAchievements);
                }
                if (totalTime < 100) {
                    checkAndUnlockAchievement(profile, "SPEEDRUNNER", newAchievements);
                }
                if (updatedMastery >= 90) {
                    checkAndUnlockAchievement(profile, "TOPIC_MASTER", newAchievements);
                }
            } else {
                // Re-attempting already solved mission
                xpEarned = 25; // small repeat practice bonus
                profile.setXp(profile.getXp() + xpEarned);
            }

            // Determine next mission in sequence
            List<Mission> worldMissions = missionRepo.findByWorldIdOrderByOrderAsc(mission.getWorldId());
            for (Mission m : worldMissions) {
                if (m.getOrder() > mission.getOrder() && !profile.getCompletedMissions().contains(m.getId())) {
                    nextMissionId = m.getId();
                    break;
                }
            }
        } else {
            // Adjust skill mastery down slightly upon failure (adaptive signal)
            String skill = mission.getSkillId();
            int currentMastery = profile.getSkillMastery().getOrDefault(skill, 20);
            profile.getSkillMastery().put(skill, Math.max(10, currentMastery - 2));
        }

        profile.setUpdatedAt(Instant.now());
        profileRepo.save(profile);

        return new MissionAttemptResponse(
            allPassed,
            overallStatus.name(),
            passedCount,
            mission.getTestCases().size(),
            totalTime,
            maxMemory,
            executionMessage,
            results,
            xpEarned,
            profile.getXp(),
            profile.getLevel(),
            leveledUp,
            profile.getSkillMastery(),
            allPassed ? mission.getConceptExplanation() : "",
            feedback,
            newAchievements,
            nextMissionId
        );
    }

    public HintResponse requestHint(String userId, String missionId, int currentTier) {
        Mission mission = missionRepo.findById(missionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mission not found: " + missionId));

        PlayerProfile profile = getOrCreateProfile(userId);
        profile.setTotalHintsUsed(profile.getTotalHintsUsed() + 1);
        profileRepo.save(profile);

        String hint = mentorService.getProgressiveHint(mission, currentTier);
        int total = mission.getHints() != null ? mission.getHints().size() : 3;
        int remaining = Math.max(0, total - currentTier);
        int penalty = currentTier * 20;

        return new HintResponse(currentTier, hint, remaining, penalty);
    }

    public BossBattleResponse getBossBattle(String bossId, String userId) {
        BossBattle b = bossRepo.findById(bossId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Boss Battle not found: " + bossId));

        PlayerProfile profile = getOrCreateProfile(userId);
        boolean defeated = profile.getDefeatedBosses().contains(bossId);

        return new BossBattleResponse(
            b.getId(),
            b.getWorldId(),
            b.getTitle(),
            b.getSubtitle(),
            b.getBossName(),
            b.getBossAvatar(),
            b.getLore(),
            b.getUnlockSkillId(),
            b.getXpReward(),
            defeated,
            1,
            b.getStages() != null ? b.getStages().size() : 4,
            b.getStages()
        );
    }

    public BossStageAttemptResponse attemptBossStage(String userId, String bossId, int stageNumber, BossStageAttemptRequest request) {
        BossBattle boss = bossRepo.findById(bossId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Boss Battle not found: " + bossId));

        if (boss.getStages() == null || stageNumber < 1 || stageNumber > boss.getStages().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid boss stage: " + stageNumber);
        }

        BossStage stage = boss.getStages().get(stageNumber - 1);
        PlayerProfile profile = getOrCreateProfile(userId);

        boolean passed = false;
        String dialogue = "";
        String mentorMsg = "";
        List<TestCaseResult> testResults = new ArrayList<>();

        switch (stage.getStageType()) {
            case "DIAGNOSE" -> {
                if (request.selectedOptionIndex() != null &&
                    request.selectedOptionIndex().equals(stage.getCorrectOptionIndex())) {
                    passed = true;
                    dialogue = "Kzzt! You spotted the flaw in my cycle?! Mere luck, fleshy debugger!";
                    mentorMsg = "Flaw isolated! Critical vulnerability identified in the Boss's memory allocation.";
                } else {
                    dialogue = "Mwahaha! You misdiagnosed the vulnerability! My quadratic loop remains invincible!";
                    mentorMsg = "Incorrect diagnosis. Observe the array boundary and termination pointer carefully.";
                }
            }
            case "FIX", "OPTIMIZE" -> {
                if (request.code() == null || request.code().isBlank()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Code submission is required.");
                }
                int passedCount = 0;
                int idx = 1;
                for (TestCase tc : stage.getTestCases()) {
                    Judge0Service.JudgeResult r = judgeService.execute(request.code(), tc);
                    boolean ok = r.status() == SubmissionStatus.ACCEPTED;
                    if (ok) passedCount++;
                    testResults.add(new TestCaseResult(idx++, ok, r.description(), r.message()));
                }
                passed = (passedCount == stage.getTestCases().size());
                if (passed) {
                    dialogue = "Gaaah! My subroutines are crumbling under your refactored logic!";
                    mentorMsg = "Core patch applied! System integrity restoring.";
                } else {
                    dialogue = "Pathetic patch! Your code shattered under my adversarial test matrix!";
                    mentorMsg = "Compilation or logic error. Review the test case outputs and adjust.";
                }
            }
            case "EXPLAIN" -> {
                AiMentorService.ExplanationEvaluation eval = mentorService.evaluateExplanation(stage, request.explanation());
                passed = eval.passed();
                mentorMsg = eval.feedback();
                if (passed) {
                    dialogue = "NOOOO! You truly grasp the algorithmic truth of time vs space! DEFEATED!";
                } else {
                    dialogue = "You recite empty words without understanding the mathematical constants!";
                }
            }
        }

        int xpEarned = 0;
        boolean bossDefeated = false;
        List<String> newAchievements = new ArrayList<>();
        int healthPercent = Math.max(0, 100 - (stageNumber * 25));

        if (passed) {
            xpEarned = stage.getStageXp();
            profile.setXp(profile.getXp() + xpEarned);

            if (stageNumber == boss.getStages().size()) {
                // Defeated whole boss!
                bossDefeated = true;
                healthPercent = 0;
                profile.getDefeatedBosses().add(bossId);

                // Grant boss completion bonus
                profile.setXp(profile.getXp() + boss.getXpReward());
                xpEarned += boss.getXpReward();

                // Unlock skill
                if (boss.getUnlockSkillId() != null) {
                    profile.getUnlockedSkills().add(boss.getUnlockSkillId());
                    profile.getSkillMastery().put(boss.getUnlockSkillId(), 50);
                }

                checkAndUnlockAchievement(profile, "BOSS_SLAYER", newAchievements);
            }

            profile.setLevel(1 + (profile.getXp() / 300));
            profile.setUpdatedAt(Instant.now());
            profileRepo.save(profile);
        }

        return new BossStageAttemptResponse(
            passed,
            stageNumber,
            bossDefeated,
            passed ? healthPercent : (100 - ((stageNumber - 1) * 25)),
            dialogue,
            mentorMsg,
            xpEarned,
            profile.getXp(),
            bossDefeated ? boss.getUnlockSkillId() : null,
            newAchievements,
            testResults
        );
    }

    public List<SkillTreeNodeResponse> getSkillTree(String userId) {
        PlayerProfile profile = getOrCreateProfile(userId);

        // Predefined DSA skill graph
        List<SkillNodeDefinition> defs = List.of(
            new SkillNodeDefinition("ARRAY", "Array Traversal", "Contiguous memory iteration & indexing", 1, 1, List.of(), "world-arrays"),
            new SkillNodeDefinition("SEARCHING", "Binary Search", "Logarithmic interval halving in sorted collections", 1, 2, List.of("ARRAY"), "world-arrays"),
            new SkillNodeDefinition("TWO_POINTERS", "Two Pointers", "Opposite & fast/slow pointer algorithms", 2, 1, List.of("ARRAY"), "world-two-pointers"),
            new SkillNodeDefinition("HASHMAP", "Hash Mapping", "O(1) average lookup, key-value hashing, frequency counting", 2, 2, List.of("ARRAY"), "world-hash-sanctum"),
            new SkillNodeDefinition("SLIDING_WINDOW", "Sliding Window", "Subarray metrics & dynamic window bounds", 3, 1, List.of("TWO_POINTERS"), "world-two-pointers"),
            new SkillNodeDefinition("STACK_QUEUE", "Stacks & Queues", "LIFO and FIFO ordering, monotonic structures", 3, 2, List.of("ARRAY"), "world-hash-sanctum"),
            new SkillNodeDefinition("DYNAMIC_PROGRAMMING", "Dynamic Programming", "Optimal substructure & memoization", 4, 1, List.of("HASHMAP", "SEARCHING"), "world-hash-sanctum")
        );

        List<SkillTreeNodeResponse> nodes = new ArrayList<>();
        for (SkillNodeDefinition d : defs) {
            boolean unlocked = profile.getUnlockedSkills().contains(d.id());
            int mastery = profile.getSkillMastery().getOrDefault(d.id(), 0);

            String status = "LOCKED";
            if (mastery >= 85) {
                status = "MASTERED";
            } else if (unlocked) {
                status = "AVAILABLE";
            }

            List<Mission> missions = missionRepo.findBySkillId(d.id());
            long completed = missions.stream().filter(m -> profile.getCompletedMissions().contains(m.getId())).count();

            nodes.add(new SkillTreeNodeResponse(
                d.id(),
                d.name(),
                d.description(),
                status,
                mastery,
                d.prerequisites(),
                d.worldId(),
                (int) completed,
                missions.size(),
                d.tier(),
                d.order()
            ));
        }

        return nodes;
    }

    public List<LeaderboardEntryResponse> getLeaderboard(String currentUserId) {
        List<PlayerProfile> top = profileRepo.findTop50ByOrderByXpDesc();
        List<LeaderboardEntryResponse> result = new ArrayList<>();
        int rank = 1;
        for (PlayerProfile p : top) {
            result.add(new LeaderboardEntryResponse(
                rank++,
                p.getUserId(),
                p.getUsername(),
                p.getLevel(),
                p.getXp(),
                p.getCompletedMissions().size(),
                p.getDefeatedBosses().size(),
                p.getStreakDays(),
                p.getUserId() != null && p.getUserId().equals(currentUserId),
                p.getUserId() != null && userRepo.findById(currentUserId)
                    .map(user -> user.getFollowingIds().contains(p.getUserId()))
                    .orElse(false)
            ));
        }
        return result;
    }

    public List<AchievementResponse> getAchievements(String userId) {
        PlayerProfile profile = getOrCreateProfile(userId);
        List<Achievement> all = achievementRepo.findAll();
        List<AchievementResponse> list = new ArrayList<>();
        for (Achievement a : all) {
            boolean unlocked = profile.getUnlockedAchievements().contains(a.getCode());
            list.add(new AchievementResponse(
                a.getId(),
                a.getCode(),
                a.getTitle(),
                a.getDescription(),
                a.getIcon(),
                a.getRarity(),
                a.getXpReward(),
                unlocked
            ));
        }
        return list;
    }

    public AiMentorService.AdaptiveRecommendation getAdaptiveNext(String userId) {
        PlayerProfile profile = getOrCreateProfile(userId);
        List<Mission> missions = missionRepo.findAll();
        List<BossBattle> bosses = bossRepo.findAll();
        return mentorService.recommendNextChallenge(profile, missions, bosses);
    }

    private void checkAndUnlockAchievement(PlayerProfile profile, String code, List<String> newlyUnlocked) {
        if (!profile.getUnlockedAchievements().contains(code)) {
            profile.getUnlockedAchievements().add(code);
            newlyUnlocked.add(code);
            achievementRepo.findByCode(code).ifPresent(a -> profile.setXp(profile.getXp() + a.getXpReward()));
        }
    }

    private void updateStreakIfNeeded(PlayerProfile p) {
        if (p.getLastActiveDate() == null) {
            p.setLastActiveDate(Instant.now());
            p.setStreakDays(1);
            return;
        }
        Instant now = Instant.now();
        long daysDiff = ChronoUnit.DAYS.between(p.getLastActiveDate().truncatedTo(ChronoUnit.DAYS), now.truncatedTo(ChronoUnit.DAYS));
        if (daysDiff == 1) {
            p.setStreakDays(p.getStreakDays() + 1);
            p.setLastActiveDate(now);
        } else if (daysDiff > 1) {
            p.setStreakDays(1);
            p.setLastActiveDate(now);
        }
    }

    private record SkillNodeDefinition(
        String id,
        String name,
        String description,
        int tier,
        int order,
        List<String> prerequisites,
        String worldId
    ) {}
}
