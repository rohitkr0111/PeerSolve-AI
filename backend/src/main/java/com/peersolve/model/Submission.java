package com.peersolve.model;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document("submissions") public class Submission {
 @Id private String id; private String userId; private String problemId; private String code; private String language; private SubmissionStatus status; private Long executionTime; private Long memory; private int testCasesPassed; private int totalTestCases; private Instant createdAt;
 public String getId(){return id;} public void setId(String v){id=v;} public String getUserId(){return userId;} public void setUserId(String v){userId=v;} public String getProblemId(){return problemId;} public void setProblemId(String v){problemId=v;} public String getCode(){return code;} public void setCode(String v){code=v;} public String getLanguage(){return language;} public void setLanguage(String v){language=v;} public SubmissionStatus getStatus(){return status;} public void setStatus(SubmissionStatus v){status=v;} public Long getExecutionTime(){return executionTime;} public void setExecutionTime(Long v){executionTime=v;} public Long getMemory(){return memory;} public void setMemory(Long v){memory=v;} public int getTestCasesPassed(){return testCasesPassed;} public void setTestCasesPassed(int v){testCasesPassed=v;} public int getTotalTestCases(){return totalTestCases;} public void setTotalTestCases(int v){totalTestCases=v;} public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
}
