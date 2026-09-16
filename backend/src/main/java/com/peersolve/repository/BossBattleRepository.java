package com.peersolve.repository;

import java.util.Optional;
import com.peersolve.model.BossBattle;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BossBattleRepository extends MongoRepository<BossBattle, String> {
    Optional<BossBattle> findByWorldId(String worldId);
}
