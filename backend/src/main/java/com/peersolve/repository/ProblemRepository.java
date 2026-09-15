package com.peersolve.repository;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.peersolve.model.Difficulty;
import com.peersolve.model.Problem;
public interface ProblemRepository extends MongoRepository<Problem,String> { List<Problem> findByTitleContainingIgnoreCase(String title); List<Problem> findByDifficulty(Difficulty difficulty); List<Problem> findByTopicsContaining(String topic); }
