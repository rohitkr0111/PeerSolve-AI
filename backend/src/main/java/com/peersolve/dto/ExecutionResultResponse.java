package com.peersolve.dto;
import java.util.List;
public record ExecutionResultResponse(String status,int testCasesPassed,int totalTestCases,Long executionTime,Long memory,String output,List<TestCaseResult> testCases) {}
