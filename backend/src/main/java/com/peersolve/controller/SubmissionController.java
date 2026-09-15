package com.peersolve.controller;
import java.util.List;
import com.peersolve.dto.*;
import com.peersolve.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/submissions") public class SubmissionController {private final SubmissionService submissions;public SubmissionController(SubmissionService submissions){this.submissions=submissions;} @PostMapping("/run") public ExecutionResultResponse run(@Valid @RequestBody SubmissionRequest request){return submissions.run(request);}@PostMapping public SubmissionResponse submit(@Valid @RequestBody SubmissionRequest request,Authentication authentication){return submissions.submit((String)authentication.getPrincipal(),request);}@GetMapping("/my") public List<SubmissionResponse> mine(Authentication authentication,@RequestParam(required=false)String problemId){return submissions.mine((String)authentication.getPrincipal(),problemId);}}
