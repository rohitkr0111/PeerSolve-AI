package com.peersolve.controller;
import java.util.List;
import com.peersolve.dto.*;
import com.peersolve.service.ProblemService;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/problems") public class ProblemController { private final ProblemService problems; public ProblemController(ProblemService problems){this.problems=problems;} @GetMapping public List<ProblemListResponse> list(@RequestParam(required=false) String difficulty,@RequestParam(required=false) String topic,@RequestParam(required=false) String search){return problems.list(difficulty,topic,search);} @GetMapping("/{id}") public ProblemDetailResponse get(@PathVariable String id){return problems.get(id);} }
