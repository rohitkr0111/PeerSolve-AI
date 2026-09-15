package com.peersolve.dto;
import java.util.List;
import com.peersolve.model.Problem;
import com.peersolve.model.ProblemExample;
public record ProblemDetailResponse(String id,String title,String description,String difficulty,List<String> topics,List<ProblemExample> examples,List<String> constraints,String starterCode,String expectedTimeComplexity,String expectedSpaceComplexity) { public static ProblemDetailResponse from(Problem p){return new ProblemDetailResponse(p.getId(),p.getTitle(),p.getDescription(),p.getDifficulty().name(),p.getTopics(),p.getExamples(),p.getConstraints(),p.getStarterCode(),p.getExpectedTimeComplexity(),p.getExpectedSpaceComplexity());} }
