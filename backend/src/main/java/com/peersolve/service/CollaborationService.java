package com.peersolve.service;

import java.time.Instant;
import java.util.UUID;
import com.peersolve.dto.CollaborationSessionResponse;
import com.peersolve.dto.CreateSessionRequest;
import com.peersolve.model.CollaborationSession;
import com.peersolve.model.Problem;
import com.peersolve.model.User;
import com.peersolve.repository.CollaborationSessionRepository;
import com.peersolve.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CollaborationService {
  private final CollaborationSessionRepository sessions;
  private final ProblemService problems;
  private final UserRepository users;

  public CollaborationService(
      CollaborationSessionRepository sessions,
      ProblemService problems,
      UserRepository users
  ) {
    this.sessions = sessions;
    this.problems = problems;
    this.users = users;
  }

  public CollaborationSessionResponse createSession(String userId, CreateSessionRequest request) {
    User host = users.findById(userId).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found")
    );
    Problem problem = problems.getEntity(request.problemId());

    String code = request.initialCode();
    if (code == null || code.isBlank()) {
      code = problem.getStarterCode();
    }

    String sessionId = "ps-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);

    CollaborationSession session = new CollaborationSession();
    session.setId(sessionId);
    session.setProblemId(problem.getId());
    session.setHostUserId(host.getId());
    session.setHostUserName(host.getName());
    session.setCurrentCode(code);
    session.getActiveUserIds().add(host.getId());
    session.getParticipantNames().put(host.getId(), host.getName());
    session.setStatus("ACTIVE");
    session.setCreatedAt(Instant.now());
    session.setUpdatedAt(Instant.now());

    return CollaborationSessionResponse.from(sessions.save(session));
  }

  public CollaborationSessionResponse getSession(String sessionId) {
    CollaborationSession session = sessions.findById(sessionId).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collaboration session not found")
    );
    return CollaborationSessionResponse.from(session);
  }

  public CollaborationSessionResponse joinSession(String sessionId, String userId) {
    CollaborationSession session = sessions.findById(sessionId).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collaboration session not found")
    );
    User user = users.findById(userId).orElse(null);
    String userName = user != null ? user.getName() : "Guest";

    session.getActiveUserIds().add(userId);
    session.getParticipantNames().put(userId, userName);
    session.setUpdatedAt(Instant.now());

    return CollaborationSessionResponse.from(sessions.save(session));
  }

  public CollaborationSessionResponse leaveSession(String sessionId, String userId) {
    return sessions.findById(sessionId).map(session -> {
      session.getActiveUserIds().remove(userId);
      session.setUpdatedAt(Instant.now());
      return CollaborationSessionResponse.from(sessions.save(session));
    }).orElse(null);
  }

  public CollaborationSessionResponse updateCode(String sessionId, String code) {
    CollaborationSession session = sessions.findById(sessionId).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collaboration session not found")
    );
    session.setCurrentCode(code);
    session.setUpdatedAt(Instant.now());
    return CollaborationSessionResponse.from(sessions.save(session));
  }
}
