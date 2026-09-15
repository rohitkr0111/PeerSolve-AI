package com.peersolve.dto;
import java.time.Instant;
import com.peersolve.model.Submission;
public record SubmissionResponse(String id,String problemId,String status,String language,Long executionTime,Long memory,int testCasesPassed,int totalTestCases,Instant createdAt,String code) { public static SubmissionResponse from(Submission s,boolean includeCode){return new SubmissionResponse(s.getId(),s.getProblemId(),s.getStatus().name(),s.getLanguage(),s.getExecutionTime(),s.getMemory(),s.getTestCasesPassed(),s.getTotalTestCases(),s.getCreatedAt(),includeCode?s.getCode():null);} }
