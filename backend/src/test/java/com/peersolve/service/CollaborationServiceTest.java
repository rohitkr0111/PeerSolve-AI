package com.peersolve.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;
import com.peersolve.dto.CollaborationSessionResponse;
import com.peersolve.dto.CreateSessionRequest;
import com.peersolve.model.CollaborationSession;
import com.peersolve.model.Problem;
import com.peersolve.model.User;
import com.peersolve.repository.CollaborationSessionRepository;
import com.peersolve.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class CollaborationServiceTest {

  @Mock CollaborationSessionRepository sessionRepository;
  @Mock ProblemService problemService;
  @Mock UserRepository userRepository;

  @InjectMocks CollaborationService collaborationService;

  @Test
  void createsCollaborationSessionSuccessfully() {
    User host = new User();
    host.setId("user-1");
    host.setName("Alice");

    Problem problem = new Problem();
    problem.setId("prob-1");
    problem.setStarterCode("public class Main {}");

    when(userRepository.findById("user-1")).thenReturn(Optional.of(host));
    when(problemService.getEntity("prob-1")).thenReturn(problem);
    when(sessionRepository.save(any(CollaborationSession.class))).thenAnswer(i -> i.getArgument(0));

    CreateSessionRequest req = new CreateSessionRequest("prob-1", null);
    CollaborationSessionResponse resp = collaborationService.createSession("user-1", req);

    assertNotNull(resp);
    assertTrue(resp.id().startsWith("ps-"));
    assertEquals("prob-1", resp.problemId());
    assertEquals("user-1", resp.hostUserId());
    assertEquals("Alice", resp.hostUserName());
    assertEquals("public class Main {}", resp.currentCode());
    assertTrue(resp.activeUserIds().contains("user-1"));
  }

  @Test
  void throwsNotFoundWhenSessionDoesNotExist() {
    when(sessionRepository.findById("non-existent")).thenReturn(Optional.empty());
    assertThrows(ResponseStatusException.class, () -> collaborationService.getSession("non-existent"));
  }

  @Test
  void joinsAndLeavesSessionSuccessfully() {
    CollaborationSession session = new CollaborationSession();
    session.setId("ps-12345678");
    session.setProblemId("prob-1");
    session.setHostUserId("user-1");
    session.getActiveUserIds().add("user-1");

    User user2 = new User();
    user2.setId("user-2");
    user2.setName("Bob");

    when(sessionRepository.findById("ps-12345678")).thenReturn(Optional.of(session));
    when(userRepository.findById("user-2")).thenReturn(Optional.of(user2));
    when(sessionRepository.save(any(CollaborationSession.class))).thenAnswer(i -> i.getArgument(0));

    CollaborationSessionResponse joined = collaborationService.joinSession("ps-12345678", "user-2");
    assertTrue(joined.activeUserIds().contains("user-2"));
    assertEquals("Bob", joined.participantNames().get("user-2"));

    CollaborationSessionResponse left = collaborationService.leaveSession("ps-12345678", "user-2");
    assertFalse(left.activeUserIds().contains("user-2"));
  }
}
