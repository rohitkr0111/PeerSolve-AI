package com.peersolve.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("achievements")
public class Achievement {
    @Id
    private String id;
    private String code;
    private String title;
    private String description;
    private String icon;
    private String rarity; // COMMON, RARE, EPIC, LEGENDARY
    private int xpReward;

    public Achievement() {}

    public Achievement(String id, String code, String title, String description, String icon, String rarity, int xpReward) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.rarity = rarity;
        this.xpReward = xpReward;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getRarity() { return rarity; }
    public void setRarity(String rarity) { this.rarity = rarity; }
    public int getXpReward() { return xpReward; }
    public void setXpReward(int xpReward) { this.xpReward = xpReward; }
}
