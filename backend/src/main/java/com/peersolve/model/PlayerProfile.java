package com.peersolve.model;

import java.time.Instant;
import java.util.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("player_profiles")
public class PlayerProfile {
    @Id
    private String id;
    @Indexed(unique = true)
    private String userId;
    private String username;
    private int xp;
    private int level;
    private int streakDays;
    private Instant lastActiveDate;
    private String activeWorldId;
    private Set<String> unlockedSkills = new HashSet<>();
    private Set<String> completedMissions = new HashSet<>();
    private Set<String> defeatedBosses = new HashSet<>();
    private Map<String, Integer> skillMastery = new HashMap<>(); // topic/skill -> 0..100
    private Set<String> unlockedAchievements = new HashSet<>();
    private int totalHintsUsed;
    private int totalAttempts;
    private Instant createdAt;
    private Instant updatedAt;

    public PlayerProfile() {}

    public PlayerProfile(String userId, String username) {
        this.userId = userId;
        this.username = username;
        this.xp = 0;
        this.level = 1;
        this.streakDays = 1;
        this.lastActiveDate = Instant.now();
        this.activeWorldId = "world-arrays";
        this.unlockedSkills = new HashSet<>(Set.of("ARRAY", "SEARCHING"));
        this.completedMissions = new HashSet<>();
        this.defeatedBosses = new HashSet<>();
        this.skillMastery = new HashMap<>(Map.of("ARRAY", 25, "SEARCHING", 20));
        this.unlockedAchievements = new HashSet<>();
        this.totalHintsUsed = 0;
        this.totalAttempts = 0;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    public int getStreakDays() { return streakDays; }
    public void setStreakDays(int streakDays) { this.streakDays = streakDays; }
    public Instant getLastActiveDate() { return lastActiveDate; }
    public void setLastActiveDate(Instant lastActiveDate) { this.lastActiveDate = lastActiveDate; }
    public String getActiveWorldId() { return activeWorldId; }
    public void setActiveWorldId(String activeWorldId) { this.activeWorldId = activeWorldId; }
    public Set<String> getUnlockedSkills() { return unlockedSkills; }
    public void setUnlockedSkills(Set<String> unlockedSkills) { this.unlockedSkills = unlockedSkills; }
    public Set<String> getCompletedMissions() { return completedMissions; }
    public void setCompletedMissions(Set<String> completedMissions) { this.completedMissions = completedMissions; }
    public Set<String> getDefeatedBosses() { return defeatedBosses; }
    public void setDefeatedBosses(Set<String> defeatedBosses) { this.defeatedBosses = defeatedBosses; }
    public Map<String, Integer> getSkillMastery() { return skillMastery; }
    public void setSkillMastery(Map<String, Integer> skillMastery) { this.skillMastery = skillMastery; }
    public Set<String> getUnlockedAchievements() { return unlockedAchievements; }
    public void setUnlockedAchievements(Set<String> unlockedAchievements) { this.unlockedAchievements = unlockedAchievements; }
    public int getTotalHintsUsed() { return totalHintsUsed; }
    public void setTotalHintsUsed(int totalHintsUsed) { this.totalHintsUsed = totalHintsUsed; }
    public int getTotalAttempts() { return totalAttempts; }
    public void setTotalAttempts(int totalAttempts) { this.totalAttempts = totalAttempts; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
