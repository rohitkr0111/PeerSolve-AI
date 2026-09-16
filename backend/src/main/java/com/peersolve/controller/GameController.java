package com.peersolve.controller;

import java.util.List;
import com.peersolve.dto.*;
import com.peersolve.service.AiMentorService;
import com.peersolve.service.GameService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    private String getUserId(Authentication auth) {
        return auth != null && auth.getPrincipal() != null ? (String) auth.getPrincipal() : "anonymous-guest";
    }

    @GetMapping("/profile")
    public PlayerProfileResponse getProfile(Authentication auth) {
        return gameService.getProfileResponse(getUserId(auth));
    }

    @GetMapping("/worlds")
    public List<GameWorldResponse> getWorlds(Authentication auth) {
        return gameService.getWorlds(getUserId(auth));
    }

    @GetMapping("/missions/{id}")
    public MissionDetailResponse getMission(@PathVariable String id, Authentication auth) {
        return gameService.getMission(id, getUserId(auth));
    }

    @PostMapping("/missions/{id}/attempt")
    public MissionAttemptResponse attemptMission(
        @PathVariable String id,
        @Valid @RequestBody MissionAttemptRequest request,
        Authentication auth
    ) {
        return gameService.attemptMission(getUserId(auth), id, request);
    }

    @PostMapping("/missions/{id}/hint")
    public HintResponse requestHint(
        @PathVariable String id,
        @RequestParam(defaultValue = "1") int tier,
        Authentication auth
    ) {
        return gameService.requestHint(getUserId(auth), id, tier);
    }

    @GetMapping("/boss/{id}")
    public BossBattleResponse getBoss(@PathVariable String id, Authentication auth) {
        return gameService.getBossBattle(id, getUserId(auth));
    }

    @PostMapping("/boss/{id}/stage/{stageNumber}")
    public BossStageAttemptResponse attemptBossStage(
        @PathVariable String id,
        @PathVariable int stageNumber,
        @RequestBody BossStageAttemptRequest request,
        Authentication auth
    ) {
        return gameService.attemptBossStage(getUserId(auth), id, stageNumber, request);
    }

    @GetMapping("/skill-tree")
    public List<SkillTreeNodeResponse> getSkillTree(Authentication auth) {
        return gameService.getSkillTree(getUserId(auth));
    }

    @GetMapping("/leaderboard")
    public List<LeaderboardEntryResponse> getLeaderboard(Authentication auth) {
        return gameService.getLeaderboard(getUserId(auth));
    }

    @GetMapping("/achievements")
    public List<AchievementResponse> getAchievements(Authentication auth) {
        return gameService.getAchievements(getUserId(auth));
    }

    @GetMapping("/adaptive/next")
    public AiMentorService.AdaptiveRecommendation getAdaptiveNext(Authentication auth) {
        return gameService.getAdaptiveNext(getUserId(auth));
    }
}
