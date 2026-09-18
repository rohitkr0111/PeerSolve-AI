package com.peersolve.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.peersolve.model.CollaborationSession;

public interface CollaborationSessionRepository extends MongoRepository<CollaborationSession, String> {
  List<CollaborationSession> findByProblemIdAndStatus(String problemId, String status);
}
