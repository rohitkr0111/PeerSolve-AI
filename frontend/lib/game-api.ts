import api, { apiError } from "@/lib/api";
import type {
  PlayerProfile,
  GameWorld,
  MissionDetail,
  MissionAttemptResult,
  BossBattle,
  BossStageResult,
  SkillTreeNode,
  LeaderboardEntry,
  Achievement,
  AdaptiveRecommendation
} from "@/types/game";

export const gameApi = {
  async getProfile(): Promise<PlayerProfile> {
    const { data } = await api.get<PlayerProfile>("/api/game/profile");
    return data;
  },

  async getWorlds(): Promise<GameWorld[]> {
    const { data } = await api.get<GameWorld[]>("/api/game/worlds");
    return data;
  },

  async getMission(id: string): Promise<MissionDetail> {
    const { data } = await api.get<MissionDetail>(`/api/game/missions/${id}`);
    return data;
  },

  async attemptMission(id: string, code: string, hintsUsed: number): Promise<MissionAttemptResult> {
    const { data } = await api.post<MissionAttemptResult>(`/api/game/missions/${id}/attempt`, {
      code,
      hintsUsed
    });
    return data;
  },

  async getHint(missionId: string, tier: number): Promise<{ tier: number; hint: string; hintsRemaining: number }> {
    const { data } = await api.post<{ tier: number; hint: string; hintsRemaining: number }>(
      `/api/game/missions/${missionId}/hint?tier=${tier}`
    );
    return data;
  },

  async getBossBattle(id: string): Promise<BossBattle> {
    const { data } = await api.get<BossBattle>(`/api/game/boss/${id}`);
    return data;
  },

  async attemptBossStage(
    bossId: string,
    stageNumber: number,
    payload: { selectedOptionIndex?: number; code?: string; explanation?: string }
  ): Promise<BossStageResult> {
    const { data } = await api.post<BossStageResult>(`/api/game/boss/${bossId}/stage/${stageNumber}`, payload);
    return data;
  },

  async getSkillTree(): Promise<SkillTreeNode[]> {
    const { data } = await api.get<SkillTreeNode[]>("/api/game/skill-tree");
    return data;
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data } = await api.get<LeaderboardEntry[]>("/api/game/leaderboard");
    return data;
  },

  async getAchievements(): Promise<Achievement[]> {
    const { data } = await api.get<Achievement[]>("/api/game/achievements");
    return data;
  },

  async getAdaptiveRecommendation(): Promise<AdaptiveRecommendation> {
    const { data } = await api.get<AdaptiveRecommendation>("/api/game/adaptive/next");
    return data;
  }
};
