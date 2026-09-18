package com.peersolve.model;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("collaboration_sessions")
public class CollaborationSession {
  @Id
  private String id;
  private String problemId;
  private String hostUserId;
  private String hostUserName;
  private String currentCode;
  private Set<String> activeUserIds = new HashSet<>();
  private Map<String, String> participantNames = new HashMap<>();
  private String status = "ACTIVE";
  private Instant createdAt;
  private Instant updatedAt;

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getProblemId() { return problemId; }
  public void setProblemId(String problemId) { this.problemId = problemId; }
  public String getHostUserId() { return hostUserId; }
  public void setHostUserId(String hostUserId) { this.hostUserId = hostUserId; }
  public String getHostUserName() { return hostUserName; }
  public void setHostUserName(String hostUserName) { this.hostUserName = hostUserName; }
  public String getCurrentCode() { return currentCode; }
  public void setCurrentCode(String currentCode) { this.currentCode = currentCode; }
  public Set<String> getActiveUserIds() { return activeUserIds; }
  public void setActiveUserIds(Set<String> activeUserIds) { this.activeUserIds = activeUserIds; }
  public Map<String, String> getParticipantNames() { return participantNames; }
  public void setParticipantNames(Map<String, String> participantNames) { this.participantNames = participantNames; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
