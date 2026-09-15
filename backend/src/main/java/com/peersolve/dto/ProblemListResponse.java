package com.peersolve.dto;
import java.util.List;
import com.peersolve.model.Problem;
public record ProblemListResponse(String id,String title,String difficulty,List<String> topics) { public static ProblemListResponse from(Problem p){return new ProblemListResponse(p.getId(),p.getTitle(),p.getDifficulty().name(),p.getTopics());} }
