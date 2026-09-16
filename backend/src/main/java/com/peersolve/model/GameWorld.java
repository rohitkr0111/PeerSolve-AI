package com.peersolve.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("game_worlds")
public class GameWorld {
    @Id
    private String id;
    private String name;
    private String subtitle;
    private String description;
    private String theme;
    private int order;
    private int requiredLevel;
    private String bossBattleId;
    private List<String> skillIds;
    private String badgeIcon;

    public GameWorld() {}

    public GameWorld(String id, String name, String subtitle, String description, String theme, int order, int requiredLevel, String bossBattleId, List<String> skillIds, String badgeIcon) {
        this.id = id;
        this.name = name;
        this.subtitle = subtitle;
        this.description = description;
        this.theme = theme;
        this.order = order;
        this.requiredLevel = requiredLevel;
        this.bossBattleId = bossBattleId;
        this.skillIds = skillIds;
        this.badgeIcon = badgeIcon;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public int getRequiredLevel() { return requiredLevel; }
    public void setRequiredLevel(int requiredLevel) { this.requiredLevel = requiredLevel; }
    public String getBossBattleId() { return bossBattleId; }
    public void setBossBattleId(String bossBattleId) { this.bossBattleId = bossBattleId; }
    public List<String> getSkillIds() { return skillIds; }
    public void setSkillIds(List<String> skillIds) { this.skillIds = skillIds; }
    public String getBadgeIcon() { return badgeIcon; }
    public void setBadgeIcon(String badgeIcon) { this.badgeIcon = badgeIcon; }
}
