package com.peersolve.dto;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import com.peersolve.model.CollaborationSession;

public record CollaborationSessionResponse(
    String id,
    String problemId,
    String hostUserId,
    String hostUserName,
    String currentCode,
    Set<String> activeUserIds,
    Map<String, String> participantNames,
    String status,
    Instant createdAt
) {
  public static CollaborationSessionResponse from(CollaborationSession session) {
    return new CollaborationSessionResponse(
        session.getId(),
        session.getProblemId(),
        session.getHostUserId(),
        session.getHostUserName(),
        session.getCurrentCode(),
        session.getActiveUserIds(),
        session.getParticipantNames(),
        session.getStatus(),
        session.getCreatedAt()
    );
  }
}
