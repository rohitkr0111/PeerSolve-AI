package com.peersolve.service;
import java.time.Instant;
import java.util.*;
import com.peersolve.dto.*;
import com.peersolve.model.*;
import com.peersolve.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
@Service public class SubmissionService {
 private final ProblemService problems; private final SubmissionRepository submissions; private final Judge0Service judge;
 public SubmissionService(ProblemService problems,SubmissionRepository submissions,Judge0Service judge){this.problems=problems;this.submissions=submissions;this.judge=judge;}
 public ExecutionResultResponse run(SubmissionRequest request){return evaluate(request,problems.getEntity(request.problemId()));}
 public SubmissionResponse submit(String userId,SubmissionRequest request){ExecutionResultResponse result=run(request); Submission s=new Submission();s.setUserId(userId);s.setProblemId(request.problemId());s.setCode(request.code());s.setLanguage("java");s.setStatus(SubmissionStatus.valueOf(result.status()));s.setExecutionTime(result.executionTime());s.setMemory(result.memory());s.setTestCasesPassed(result.testCasesPassed());s.setTotalTestCases(result.totalTestCases());s.setCreatedAt(Instant.now());return SubmissionResponse.from(submissions.save(s),true);}
 public List<SubmissionResponse> mine(String userId,String problemId){List<Submission> list=problemId==null||problemId.isBlank()?submissions.findByUserIdOrderByCreatedAtDesc(userId):submissions.findByUserIdAndProblemIdOrderByCreatedAtDesc(userId,problemId);return list.stream().map(s->SubmissionResponse.from(s,true)).toList();}
 public DashboardStatsResponse stats(String userId){List<Submission>s=submissions.findByUserId(userId);long attempted=s.stream().map(Submission::getProblemId).distinct().count();long solved=s.stream().filter(x->x.getStatus()==SubmissionStatus.ACCEPTED).map(Submission::getProblemId).distinct().count();long rate=attempted==0?0:Math.round((solved*100.0)/attempted);return new DashboardStatsResponse(solved,attempted,rate);}
 private ExecutionResultResponse evaluate(SubmissionRequest request,Problem problem){List<TestCaseResult> results=new ArrayList<>();int passed=0;long time=0,memory=0;String output="";SubmissionStatus finalStatus=SubmissionStatus.ACCEPTED;int i=1;for(TestCase test:problem.getTestCases()){Judge0Service.JudgeResult r=judge.execute(request.code(),test);boolean ok=r.status()==SubmissionStatus.ACCEPTED;if(ok)passed++;else if(finalStatus==SubmissionStatus.ACCEPTED)finalStatus=r.status();time+=r.executionTime();memory=Math.max(memory,r.memory());output=r.message();results.add(new TestCaseResult(i++,ok,r.description(),r.message()));}return new ExecutionResultResponse(finalStatus.name(),passed,problem.getTestCases().size(),time,memory,output,results);}
}
