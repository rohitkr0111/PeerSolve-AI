package com.peersolve.service;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import com.fasterxml.jackson.databind.JsonNode;
import com.peersolve.model.SubmissionStatus;
import com.peersolve.model.TestCase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;
@Service public class Judge0Service {
 private final String url,key,host; private final RestClient client=RestClient.create();
 public Judge0Service(@Value("${app.judge0.url:}")String url,@Value("${app.judge0.api-key:}")String key,@Value("${app.judge0.api-host:}")String host){this.url=url;this.key=key;this.host=host;}
 public JudgeResult execute(String code,TestCase test){if(url.isBlank())throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"Code execution is not configured. Set JUDGE0_URL first."); try {var request=client.post().uri(url+(url.contains("?")?"&":"?")+"base64_encoded=true&wait=true").contentType(MediaType.APPLICATION_JSON).header("X-Auth-Token",key).header("X-RapidAPI-Key",key); if(!host.isBlank())request=request.header("X-RapidAPI-Host",host); JsonNode body=request.body(Map.of("language_id",62,"source_code",encode(code),"stdin",encode(test.getInput()),"expected_output",encode(test.getExpectedOutput()))).retrieve().body(JsonNode.class); if(body==null)throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,"Execution service returned no result"); int statusId=body.path("status").path("id").asInt(); String status=body.path("status").path("description").asText("Execution failed"); String output=decode(body.path("stdout").asText("")); String compile=decode(body.path("compile_output").asText("")); String stderr=decode(body.path("stderr").asText("")); String message=!compile.isBlank()?compile:(!stderr.isBlank()?stderr:output); long time=(long)(body.path("time").asDouble(0)*1000); long memory=body.path("memory").asLong(0); return new JudgeResult(mapStatus(statusId),status,output,message,time,memory); } catch(ResponseStatusException e){throw e;}catch(RestClientException e){throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,"Execution service is unavailable");}}
 private String encode(String value){return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));} private String decode(String value){try{return new String(Base64.getDecoder().decode(value),StandardCharsets.UTF_8);}catch(IllegalArgumentException e){return value;}}
 private SubmissionStatus mapStatus(int id){return switch(id){case 3->SubmissionStatus.ACCEPTED;case 4->SubmissionStatus.WRONG_ANSWER;case 5->SubmissionStatus.TIME_LIMIT;case 6->SubmissionStatus.COMPILE_ERROR;default->SubmissionStatus.RUNTIME_ERROR;};}
 public record JudgeResult(SubmissionStatus status,String description,String output,String message,long executionTime,long memory) {}
}
