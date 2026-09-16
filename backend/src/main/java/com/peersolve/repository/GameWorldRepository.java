package com.peersolve.repository;

import java.util.List;
import com.peersolve.model.GameWorld;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GameWorldRepository extends MongoRepository<GameWorld, String> {
    List<GameWorld> findAllByOrderByOrderAsc();
}
