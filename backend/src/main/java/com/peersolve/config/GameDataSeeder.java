package com.peersolve.config;

import java.time.Instant;
import java.util.*;
import com.peersolve.model.*;
import com.peersolve.repository.*;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GameDataSeeder {

    @Bean
    ApplicationRunner seedGameData(
        GameWorldRepository worldRepo,
        MissionRepository missionRepo,
        BossBattleRepository bossRepo,
        AchievementRepository achievementRepo,
        PlayerProfileRepository profileRepo
    ) {
        return args -> {
            // 1. Seed Achievements
            if (achievementRepo.count() == 0) {
                achievementRepo.saveAll(List.of(
                    new Achievement("ach-1", "FIRST_MISSION", "First Blood", "Complete your first tactical learning mission.", "Crosshair", "COMMON", 50),
                    new Achievement("ach-2", "HINTLESS_SOLVER", "Unassisted Prodigy", "Solve a mission with zero mentor hints.", "Zap", "RARE", 100),
                    new Achievement("ach-3", "BOSS_SLAYER", "Boss Slayer", "Obliterate an algorithmic boss battle.", "Skull", "EPIC", 250),
                    new Achievement("ach-4", "SPEEDRUNNER", "Quantum Velocity", "Execute test suite in under 100 milliseconds.", "Gauge", "RARE", 75),
                    new Achievement("ach-5", "TOPIC_MASTER", "Neural Grandmaster", "Reach 90%+ mastery in any algorithmic domain.", "Award", "LEGENDARY", 200),
                    new Achievement("ach-6", "PERSISTENCE", "Unyielding Core", "Log 5 distinct challenge attempts.", "Shield", "COMMON", 40)
                ));
            }

            // 2. Seed Game Worlds
            if (worldRepo.count() == 0) {
                worldRepo.saveAll(List.of(
                    new GameWorld("world-arrays", "Sector 01: Silicon Plains", "Linear Memory & Array Traversal",
                        "Initialize neural debug links. Master contiguous memory scanning, linear boundaries, and logarithmic partitioning.",
                        "NEON_CYBER", 1, 1, "boss-chrono-consumer", List.of("ARRAY", "SEARCHING"), "Cpu"),
                    new GameWorld("world-two-pointers", "Sector 02: Twin Pointers", "Bidirectional Scanners & Window Drifts",
                        "Deploy dual-cursor algorithms to scan strings and arrays in-place with O(1) auxiliary memory overhead.",
                        "QUANTUM_VOID", 2, 2, "boss-buffer-titan", List.of("TWO_POINTERS", "SLIDING_WINDOW"), "GitFork"),
                    new GameWorld("world-hash-sanctum", "Sector 03: Hash Sanctum", "O(1) Spatial Lookups & Frequency Shards",
                        "Transcend linear bounds by trading auxiliary space for instant constant-time element lookup and frequency indexing.",
                        "CRYPTO_MATRIX", 3, 3, "boss-colossus-collision", List.of("HASHMAP", "STACK_QUEUE"), "Database")
                ));
            }

            // 3. Seed Missions
            if (missionRepo.count() == 0) {
                // World 1 Missions
                Mission m1 = new Mission();
                m1.setId("mission-array-1");
                m1.setWorldId("world-arrays");
                m1.setSkillId("ARRAY");
                m1.setTitle("Operation Twin Sensors: Find the Checksum");
                m1.setStory("Perimeter security sensors have flagged an anomalous packet stream. Two distinct sensors emitted readings whose values sum exactly to the target checksum. Locate their indices to recalibrate the defense grid.");
                m1.setObjective("Read array size N, followed by N integers, and target sum. Print the 0-based indices of the two numbers that sum to target, separated by a space.");
                m1.setChallengeType("CODE");
                m1.setDifficulty(Difficulty.EASY);
                m1.setExpectedTimeComplexity("O(n)");
                m1.setExpectedSpaceComplexity("O(n)");
                m1.setStarterCode("""
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        // TODO: Find two indices i and j such that nums[i] + nums[j] == target.
        // Print: i + " " + j (or smaller index first)
        
    }
}
""");
                m1.setExamples(List.of(
                    new ProblemExample("4\n2 7 11 15\n9", "0 1", "nums[0] + nums[1] == 2 + 7 == 9"),
                    new ProblemExample("3\n3 2 4\n6", "1 2", "nums[1] + nums[2] == 2 + 4 == 6")
                ));
                m1.setConstraints(List.of("2 <= N <= 10^5", "-10^9 <= nums[i] <= 10^9", "Exactly one valid solution exists."));
                m1.setTestCases(List.of(
                    new TestCase("4\n2 7 11 15\n9", "0 1"),
                    new TestCase("3\n3 2 4\n6", "1 2"),
                    new TestCase("2\n3 3\n6", "0 1")
                ));
                m1.setHints(List.of(
                    "What target value must you pair with each number nums[i] to form the checksum?",
                    "Instead of re-scanning with a nested loop (O(N²)), record numbers you have already visited in a Map.",
                    "For each nums[i], compute complement = target - nums[i]. If map.containsKey(complement), print map.get(complement) + \" \" + i. Otherwise, put(nums[i], i)."
                ));
                m1.setMisconceptionRules(List.of(
                    new MisconceptionRule("rule-1", "for[\\s\\S]*for", "Nested Loop Alert: An inner loop scanning for the pair takes O(N²) time. Use a HashMap to check in O(1) time.", "Introduce a HashMap<Integer, Integer> to map values to indices.")
                ));
                m1.setConceptExplanation("Hashing Trade-off: By trading O(N) extra space in a HashMap, we eliminate the inner scanning loop and reduce search complexity from O(N²) quadratic time to O(N) linear time.");
                m1.setXpReward(150);
                m1.setOrder(1);

                Mission m2 = new Mission();
                m2.setId("mission-array-2");
                m2.setWorldId("world-arrays");
                m2.setSkillId("ARRAY");
                m2.setTitle("Operation Duplicate Breach: Signal Anomaly");
                m2.setStory("Rogue telemetry streams have infiltrated the memory stack. If any packet ID appears at least twice, sound the breach alarm immediately.");
                m2.setObjective("Read array size N, followed by N integers. Print 'true' if any value appears at least twice; otherwise print 'false'.");
                m2.setChallengeType("CODE");
                m2.setDifficulty(Difficulty.EASY);
                m2.setExpectedTimeComplexity("O(n)");
                m2.setExpectedSpaceComplexity("O(n)");
                m2.setStarterCode("""
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

        // TODO: Detect if any value occurs at least twice.
        // Output 'true' or 'false'
        
    }
}
""");
                m2.setExamples(List.of(
                    new ProblemExample("4\n1 2 3 1", "true", "1 appears at index 0 and 3"),
                    new ProblemExample("4\n1 2 3 4", "false", "All elements distinct")
                ));
                m2.setConstraints(List.of("1 <= N <= 10^5", "-10^9 <= nums[i] <= 10^9"));
                m2.setTestCases(List.of(
                    new TestCase("4\n1 2 3 1", "true"),
                    new TestCase("4\n1 2 3 4", "false"),
                    new TestCase("10\n1 1 1 3 3 4 3 2 4 2", "true")
                ));
                m2.setHints(List.of(
                    "You do not need to keep track of full counts, only whether you have encountered an element previously.",
                    "A HashSet provides O(1) expected time for both insertions and containment checks.",
                    "Iterate through nums. If !set.add(x), you found a duplicate! Print true and exit. If loop completes, print false."
                ));
                m2.setConceptExplanation("Set Membership: HashSet computes a hash code for each key, directing it to an internal bucket in O(1) time. This beats brute force O(N²) without requiring array mutation.");
                m2.setXpReward(120);
                m2.setOrder(2);

                Mission m3 = new Mission();
                m3.setId("mission-search-1");
                m3.setWorldId("world-arrays");
                m3.setSkillId("SEARCHING");
                m3.setTitle("Operation Binary Probe: Logarithmic Intercept");
                m3.setStory("A frequency cipher has been loaded into a sorted registry. Locate its exact address index in O(log N) cycles before the surveillance timer expires.");
                m3.setObjective("Read array size N, followed by N sorted integers, and target integer. Print the index of target, or -1 if not found.");
                m3.setChallengeType("CODE");
                m3.setDifficulty(Difficulty.EASY);
                m3.setExpectedTimeComplexity("O(log n)");
                m3.setExpectedSpaceComplexity("O(1)");
                m3.setStarterCode("""
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        // TODO: Binary search for target in O(log n) time
        
    }
}
""");
                m3.setExamples(List.of(
                    new ProblemExample("6\n-1 0 3 5 9 12\n9", "4", "9 exists at index 4"),
                    new ProblemExample("6\n-1 0 3 5 9 12\n2", "-1", "2 does not exist")
                ));
                m3.setConstraints(List.of("1 <= N <= 10^5", "nums is sorted in ascending order."));
                m3.setTestCases(List.of(
                    new TestCase("6\n-1 0 3 5 9 12\n9", "4"),
                    new TestCase("6\n-1 0 3 5 9 12\n2", "-1"),
                    new TestCase("1\n5\n5", "0")
                ));
                m3.setHints(List.of(
                    "Because the array is sorted, comparing target with the middle element halves the search space.",
                    "Maintain two pointers: low = 0, high = n - 1. Calculate mid = low + (high - low) / 2.",
                    "If nums[mid] == target, print mid. If nums[mid] < target, search right (low = mid + 1). Else search left (high = mid - 1)."
                ));
                m3.setConceptExplanation("Divide and Conquer: By discarding half the remaining search space with each comparison, binary search scales logarithmically — 1,000,000 elements take at most 20 checks!");
                m3.setXpReward(140);
                m3.setOrder(3);

                // Sector 2 Mission (Two Pointers)
                Mission m4 = new Mission();
                m4.setId("mission-pointer-1");
                m4.setWorldId("world-two-pointers");
                m4.setSkillId("TWO_POINTERS");
                m4.setTitle("Operation Palindrome Gateway: Mirror Check");
                m4.setStory("A quantum gateway requires symmetric alphanumeric passphrases. Filter non-alphanumeric noise and test if the phrase reads identically forward and backward.");
                m4.setObjective("Read a string. Discard non-alphanumeric characters and ignore case. Print 'true' if palindrome, 'false' otherwise.");
                m4.setChallengeType("CODE");
                m4.setDifficulty(Difficulty.EASY);
                m4.setExpectedTimeComplexity("O(n)");
                m4.setExpectedSpaceComplexity("O(1)");
                m4.setStarterCode("""
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) return;

        // TODO: Two pointers checking characters from left and right inward
        
    }
}
""");
                m4.setExamples(List.of(
                    new ProblemExample("A man, a plan, a canal: Panama", "true", "amanaplanacanalpanama is a palindrome"),
                    new ProblemExample("race a car", "false", "raceacar is not a palindrome")
                ));
                m4.setConstraints(List.of("1 <= s.length() <= 2 * 10^5"));
                m4.setTestCases(List.of(
                    new TestCase("A man, a plan, a canal: Panama", "true"),
                    new TestCase("race a car", "false"),
                    new TestCase(" ", "true")
                ));
                m4.setHints(List.of(
                    "Use one pointer starting at 0 and another pointer at s.length() - 1.",
                    "Skip characters that are not Character.isLetterOrDigit(c).",
                    "Compare Character.toLowerCase(s.charAt(i)) with Character.toLowerCase(s.charAt(j))."
                ));
                m4.setConceptExplanation("In-Place Two Pointer Scan: Converging pointers avoid creating auxiliary reversed string copies, maintaining O(1) additional memory.");
                m4.setXpReward(160);
                m4.setOrder(1);

                missionRepo.saveAll(List.of(m1, m2, m3, m4));
            }

            // 4. Seed Boss Battle
            if (bossRepo.count() == 0) {
                BossBattle boss1 = new BossBattle();
                boss1.setId("boss-chrono-consumer");
                boss1.setWorldId("world-arrays");
                boss1.setTitle("THE CHRONO-CONSUMER");
                boss1.setSubtitle("Guardian of the Quadratic Abyss");
                boss1.setBossName("Chrono-Consumer Core v2.4");
                boss1.setBossAvatar("Flame");
                boss1.setLore("An algorithmic anomaly that trap processes in O(N²) CPU starvation loops. Breach its defense barriers across four tactical stages to defeat it.");
                boss1.setUnlockSkillId("TWO_POINTERS");
                boss1.setXpReward(500);

                // Stage 1: DIAGNOSE
                BossStage s1 = new BossStage();
                s1.setStageNumber(1);
                s1.setStageType("DIAGNOSE");
                s1.setTitle("Stage 1: Diagnose the Infinite Loop");
                s1.setInstructions("The Boss runs an automated binary search subroutine that hangs indefinitely under certain edge inputs. Inspect the snippet and isolate the fatal bug.");
                s1.setDialogue("You cannot pierce my recursion, humanoid! My loops run eternally!");
                s1.setBuggyCode("""
int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) {
            left = mid; // <-- INSPECT THIS LINE
        } else {
            right = mid - 1;
        }
    }
    return -1;
}
""");
                s1.setDiagnoseOptions(List.of(
                    "The integer division in (left + right) / 2 throws an ArithmeticException.",
                    "Setting left = mid instead of mid + 1 prevents progress when left + 1 == right, causing an infinite loop.",
                    "Binary search is not permitted on arrays with negative numbers.",
                    "The right boundary should initialize to arr.length instead of arr.length - 1."
                ));
                s1.setCorrectOptionIndex(1); // 0-indexed option 1
                s1.setMentorHint("Look at what happens when left = 2 and right = 3. mid calculates to 2. If arr[2] < target, what does left become?");
                s1.setStageXp(100);

                // Stage 2: FIX
                BossStage s2 = new BossStage();
                s2.setStageNumber(2);
                s2.setStageType("FIX");
                s2.setTitle("Stage 2: Patch the Subroutine");
                s2.setInstructions("Implement the corrected binary search logic so all target queries return accurate indices without hanging.");
                s2.setDialogue("Kzzt! You spotted my loop flaw?! Let's see if your code can withstand my unit test barrage!");
                s2.setStarterCode("""
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int target = sc.nextInt();

        int left = 0, right = n - 1;
        int ans = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) {
                ans = mid;
                break;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        System.out.println(ans);
    }
}
""");
                s2.setTestCases(List.of(
                    new TestCase("5\n1 3 5 7 9\n7", "3"),
                    new TestCase("5\n1 3 5 7 9\n2", "-1")
                ));
                s2.setStageXp(120);

                // Stage 3: OPTIMIZE
                BossStage s3 = new BossStage();
                s3.setStageNumber(3);
                s3.setStageType("OPTIMIZE");
                s3.setTitle("Stage 3: The Stock Arbitrage Optimization");
                s3.setInstructions("The Boss demands maximum profit from array of stock prices. A nested loop O(N²) will trigger a Time Limit Exceeded. Implement in O(N) time and O(1) space.");
                s3.setDialogue("My data stream is massive! An O(N²) solution will melt your registers!");
                s3.setStarterCode("""
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();

        // TODO: Compute max profit in a single pass O(n) time, O(1) space
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
        }
        System.out.println(maxProfit);
    }
}
""");
                s3.setTestCases(List.of(
                    new TestCase("6\n7 1 5 3 6 4", "5"),
                    new TestCase("5\n7 6 4 3 1", "0")
                ));
                s3.setStageXp(130);

                // Stage 4: EXPLAIN
                BossStage s4 = new BossStage();
                s4.setStageNumber(4);
                s4.setStageType("EXPLAIN");
                s4.setTitle("Stage 4: Conceptual Defense Evaluation");
                s4.setInstructions("To finalize the Boss defeat, explain the algorithmic trade-off: Why does using auxiliary memory (like a HashMap or minimum tracker) optimize time complexity from O(N²) to O(N)?");
                s4.setDialogue("You may execute code, but do you comprehend the mathematical foundations? Prove your mastery!");
                s4.setExpectedKeywords(List.of("time", "space", "o(n)", "complexity", "tradeoff", "hash", "linear"));
                s4.setStageXp(150);

                boss1.setStages(List.of(s1, s2, s3, s4));
                bossRepo.save(boss1);
            }

            // 5. Seed Leaderboard Demo Users
            if (profileRepo.count() == 0) {
                PlayerProfile p1 = new PlayerProfile("seed-user-1", "Aura_Vanguard");
                p1.setXp(2450);
                p1.setLevel(8);
                p1.setStreakDays(14);
                p1.setCompletedMissions(Set.of("mission-array-1", "mission-array-2", "mission-search-1", "mission-pointer-1"));
                p1.setDefeatedBosses(Set.of("boss-chrono-consumer"));
                p1.setSkillMastery(Map.of("ARRAY", 95, "SEARCHING", 90, "TWO_POINTERS", 85));

                PlayerProfile p2 = new PlayerProfile("seed-user-2", "CyberBlade_99");
                p2.setXp(1620);
                p2.setLevel(5);
                p2.setStreakDays(9);
                p2.setCompletedMissions(Set.of("mission-array-1", "mission-array-2", "mission-search-1"));
                p2.setDefeatedBosses(Set.of("boss-chrono-consumer"));
                p2.setSkillMastery(Map.of("ARRAY", 85, "SEARCHING", 80));

                PlayerProfile p3 = new PlayerProfile("seed-user-3", "BinarySorcerer");
                p3.setXp(980);
                p3.setLevel(4);
                p3.setStreakDays(5);
                p3.setCompletedMissions(Set.of("mission-array-1", "mission-array-2"));
                p3.setSkillMastery(Map.of("ARRAY", 70, "SEARCHING", 50));

                PlayerProfile p4 = new PlayerProfile("seed-user-4", "HexaDrifter");
                p4.setXp(620);
                p4.setLevel(3);
                p4.setStreakDays(3);
                p4.setCompletedMissions(Set.of("mission-array-1"));
                p4.setSkillMastery(Map.of("ARRAY", 45));

                profileRepo.saveAll(List.of(p1, p2, p3, p4));
            }
        };
    }
}
