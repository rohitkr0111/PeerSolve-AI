package com.peersolve.repository;

import java.util.List;
import java.util.Optional;
import com.peersolve.model.PlayerProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlayerProfileRepository extends MongoRepository<PlayerProfile, String> {
    Optional<PlayerProfile> findByUserId(String userId);
    List<PlayerProfile> findTop50ByOrderByXpDesc();
}
