package com.peersolve.repository;

import java.util.Optional;
import com.peersolve.model.Achievement;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AchievementRepository extends MongoRepository<Achievement, String> {
    Optional<Achievement> findByCode(String code);
}
