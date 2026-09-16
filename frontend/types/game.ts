export interface PlayerProfile {
  id: string;
  userId: string;
  username: string;
  xp: number;
  level: number;
  streakDays: number;
  activeWorldId: string;
  unlockedSkills: string[];
  completedMissions: string[];
  defeatedBosses: string[];
  skillMastery: Record<string, number>;
  unlockedAchievements: string[];
  totalHintsUsed: number;
  totalAttempts: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
}

export interface MissionSummary {
  id: string;
  worldId: string;
  skillId: string;
  title: string;
  objective: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  xpReward: number;
  order: number;
  completed: boolean;
  unlocked: boolean;
}

export interface GameWorld {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  theme: string;
  order: number;
  requiredLevel: number;
  unlocked: boolean;
  completedMissionsCount: number;
  totalMissionsCount: number;
  progressPercent: number;
  bossDefeated: boolean;
  bossBattleId: string;
  missions: MissionSummary[];
  badgeIcon: string;
}

export interface TestCaseResult {
  number: number;
  passed: boolean;
  status: string;
  output: string;
}

export interface MissionDetail {
  id: string;
  worldId: string;
  skillId: string;
  title: string;
  story: string;
  objective: string;
  challengeType: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  starterCode: string;
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
  sampleTestCases: { input: string; expectedOutput: string }[];
  totalHintsAvailable: number;
  xpReward: number;
  completed: boolean;
  order: number;
}

export interface MentorFeedback {
  mentorName: string;
  mentorAvatar: string;
  diagnosis: string;
  message: string;
  suggestedAction: string;
  tone: "ENCOURAGING" | "ALERT" | "TRIUMPHANT" | "ANALYTICAL";
}

export interface MissionAttemptResult {
  passed: boolean;
  status: string;
  testCasesPassed: number;
  totalTestCases: number;
  executionTime: number;
  memory: number;
  output: string;
  testCaseResults: TestCaseResult[];
  xpEarned: number;
  totalXp: number;
  currentLevel: number;
  leveledUp: boolean;
  skillMastery: Record<string, number>;
  conceptExplanation: string;
  aiMentorFeedback: MentorFeedback;
  newlyUnlockedAchievements: string[];
  nextMissionId: string | null;
}

export interface BossStage {
  stageNumber: number;
  stageType: "DIAGNOSE" | "FIX" | "OPTIMIZE" | "EXPLAIN";
  title: string;
  instructions: string;
  dialogue: string;
  buggyCode?: string;
  diagnoseOptions?: string[];
  correctOptionIndex?: number;
  starterCode?: string;
  expectedKeywords?: string[];
  mentorHint?: string;
  stageXp: number;
}

export interface BossBattle {
  id: string;
  worldId: string;
  title: string;
  subtitle: string;
  bossName: string;
  bossAvatar: string;
  lore: string;
  unlockSkillId: string;
  xpReward: number;
  defeated: boolean;
  currentStageNumber: number;
  totalStages: number;
  stages: BossStage[];
}

export interface BossStageResult {
  passed: boolean;
  stageNumber: number;
  bossDefeated: boolean;
  bossHealthPercent: number;
  bossDialogue: string;
  mentorFeedback: string;
  xpEarned: number;
  totalXp: number;
  unlockedSkillId: string | null;
  newlyUnlockedAchievements: string[];
  testCaseResults: TestCaseResult[];
}

export interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  status: "LOCKED" | "AVAILABLE" | "MASTERED";
  masteryScore: number;
  prerequisites: string[];
  worldId: string;
  missionsCompleted: number;
  totalMissions: number;
  tier: number;
  order: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  level: number;
  xp: number;
  missionsCompleted: number;
  bossesDefeated: number;
  streakDays: number;
  isCurrentPlayer: boolean;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  xpReward: number;
  unlocked: boolean;
}

export interface AdaptiveRecommendation {
  missionId: string;
  title: string;
  worldId: string;
  reason: string;
  difficulty: string;
}
