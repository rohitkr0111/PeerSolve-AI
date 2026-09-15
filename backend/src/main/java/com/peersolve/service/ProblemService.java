package com.peersolve.service;
import java.util.*;
import java.util.stream.Stream;
import com.peersolve.dto.*;
import com.peersolve.model.*;
import com.peersolve.repository.ProblemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
@Service public class ProblemService {
 private final ProblemRepository problems; public ProblemService(ProblemRepository problems){this.problems=problems;}
 public List<ProblemListResponse> list(String difficulty,String topic,String search){Stream<Problem> stream=problems.findAll().stream(); if(difficulty!=null&&!difficulty.isBlank()){try{Difficulty d=Difficulty.valueOf(difficulty.trim().toUpperCase());stream=stream.filter(p->p.getDifficulty()==d);}catch(IllegalArgumentException e){throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid difficulty");}} if(topic!=null&&!topic.isBlank()){String t=topic.trim().toUpperCase();stream=stream.filter(p->p.getTopics().stream().anyMatch(x->x.equalsIgnoreCase(t)));} if(search!=null&&!search.isBlank()){String s=search.trim().toLowerCase();stream=stream.filter(p->p.getTitle().toLowerCase().contains(s));} return stream.sorted(Comparator.comparing(Problem::getTitle)).map(ProblemListResponse::from).toList();}
 public Problem getEntity(String id){return problems.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Problem not found"));}
 public ProblemDetailResponse get(String id){return ProblemDetailResponse.from(getEntity(id));}
}
