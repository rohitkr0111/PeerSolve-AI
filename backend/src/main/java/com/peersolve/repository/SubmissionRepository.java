package com.peersolve.repository;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.peersolve.model.Submission;
public interface SubmissionRepository extends MongoRepository<Submission,String> { List<Submission> findByUserIdOrderByCreatedAtDesc(String userId); List<Submission> findByUserIdAndProblemIdOrderByCreatedAtDesc(String userId,String problemId); List<Submission> findByUserId(String userId); }
