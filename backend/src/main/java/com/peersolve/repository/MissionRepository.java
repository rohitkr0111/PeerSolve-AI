package com.peersolve.repository;

import java.util.List;
import com.peersolve.model.Mission;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MissionRepository extends MongoRepository<Mission, String> {
    List<Mission> findByWorldIdOrderByOrderAsc(String worldId);
    List<Mission> findBySkillId(String skillId);
}
