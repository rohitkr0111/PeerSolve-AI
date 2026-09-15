package com.peersolve.controller;
import com.peersolve.dto.DashboardStatsResponse;
import com.peersolve.service.SubmissionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/dashboard") public class DashboardController {private final SubmissionService submissions;public DashboardController(SubmissionService submissions){this.submissions=submissions;}@GetMapping("/stats") public DashboardStatsResponse stats(Authentication auth){return submissions.stats((String)auth.getPrincipal());}}
