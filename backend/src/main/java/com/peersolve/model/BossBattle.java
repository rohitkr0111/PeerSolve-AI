package com.peersolve.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("boss_battles")
public class BossBattle {
    @Id
    private String id;
    private String worldId;
    private String title;
    private String subtitle;
    private String bossName;
    private String bossAvatar;
    private String lore;
    private String unlockSkillId;
    private int xpReward;
    private List<BossStage> stages;

    public BossBattle() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorldId() { return worldId; }
    public void setWorldId(String worldId) { this.worldId = worldId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getBossName() { return bossName; }
    public void setBossName(String bossName) { this.bossName = bossName; }
    public String getBossAvatar() { return bossAvatar; }
    public void setBossAvatar(String bossAvatar) { this.bossAvatar = bossAvatar; }
    public String getLore() { return lore; }
    public void setLore(String lore) { this.lore = lore; }
    public String getUnlockSkillId() { return unlockSkillId; }
    public void setUnlockSkillId(String unlockSkillId) { this.unlockSkillId = unlockSkillId; }
    public int getXpReward() { return xpReward; }
    public void setXpReward(int xpReward) { this.xpReward = xpReward; }
    public List<BossStage> getStages() { return stages; }
    public void setStages(List<BossStage> stages) { this.stages = stages; }
}
