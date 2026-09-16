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

@Service
public class Judge0Service {

    private final String url;
    private final String key;
    private final String host;

    private final RestClient client = RestClient.create();

    public Judge0Service(
            @Value("${app.judge0.url:}") String url,
            @Value("${app.judge0.api-key:}") String key,
            @Value("${app.judge0.api-host:}") String host
    ) {
        this.url = url;
        this.key = key;
        this.host = host;
    }

    public JudgeResult execute(String code, TestCase test) {
        if (!url.isBlank() && !key.isBlank() && !host.isBlank()) {
            try {
                return executeRemote(code, test);
            } catch (Exception e) {
                System.out.println("Judge0 remote execution failed (" + e.getMessage() + "). Falling back to local execution.");
            }
        }
        return executeLocal(code, test);
    }

    private JudgeResult executeRemote(String code, TestCase test) {
        try {
            String endpoint = url
                    + (url.contains("?") ? "&" : "?")
                    + "base64_encoded=true&wait=true";

            var request = client
                    .post()
                    .uri(endpoint)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("X-RapidAPI-Key", key)
                    .header("X-RapidAPI-Host", host);

            JsonNode body = request
                    .body(Map.of(
                            "language_id", 62,
                            "source_code", encode(code),
                            "stdin", encode(test.getInput()),
                            "expected_output", encode(test.getExpectedOutput())
                    ))
                    .retrieve()
                    .body(JsonNode.class);

            if (body == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Judge0 returned no result."
                    );
            }

            int statusId = body.path("status").path("id").asInt();
            String status = body.path("status").path("description").asText("Execution failed");
            String output = decode(body.path("stdout").asText(""));
            String compile = decode(body.path("compile_output").asText(""));
            String stderr = decode(body.path("stderr").asText(""));
            String message = !compile.isBlank() ? compile : (!stderr.isBlank() ? stderr : output);
            long time = (long) (body.path("time").asDouble(0) * 1000);
            long memory = body.path("memory").asLong(0);

            return new JudgeResult(mapStatus(statusId), status, output, message, time, memory);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Judge0 request failed: " + e.getMessage());
        }
    }

    private JudgeResult executeLocal(String code, TestCase test) {
        long start = System.currentTimeMillis();
        try {
            java.nio.file.Path tempDir = java.nio.file.Files.createTempDirectory("ps_sandbox_");
            java.nio.file.Path sourceFile = tempDir.resolve("Main.java");
            java.nio.file.Files.writeString(sourceFile, code);

            ProcessBuilder compilePb = new ProcessBuilder("javac", sourceFile.toString());
            Process compileProcess = compilePb.start();
            boolean compiledOk = compileProcess.waitFor(10, java.util.concurrent.TimeUnit.SECONDS);
            if (!compiledOk || compileProcess.exitValue() != 0) {
                String compileErr = new String(compileProcess.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
                return new JudgeResult(SubmissionStatus.COMPILE_ERROR, "Compilation Error", "", compileErr, System.currentTimeMillis() - start, 0);
            }

            ProcessBuilder runPb = new ProcessBuilder("java", "-cp", tempDir.toString(), "Main");
            Process runProcess = runPb.start();

            if (test.getInput() != null) {
                try (var os = runProcess.getOutputStream()) {
                    os.write(test.getInput().getBytes(StandardCharsets.UTF_8));
                    os.flush();
                }
            }

            boolean finished = runProcess.waitFor(4, java.util.concurrent.TimeUnit.SECONDS);
            long runtime = System.currentTimeMillis() - start;
            if (!finished) {
                runProcess.destroyForcibly();
                return new JudgeResult(SubmissionStatus.TIME_LIMIT, "Time Limit Exceeded", "", "Execution timed out (4s limit)", runtime, 0);
            }

            String stdout = new String(runProcess.getInputStream().readAllBytes(), StandardCharsets.UTF_8).trim();
            String stderr = new String(runProcess.getErrorStream().readAllBytes(), StandardCharsets.UTF_8).trim();

            if (runProcess.exitValue() != 0) {
                return new JudgeResult(SubmissionStatus.RUNTIME_ERROR, "Runtime Error", stdout, stderr.isBlank() ? "Exited with code " + runProcess.exitValue() : stderr, runtime, 0);
            }

            String expected = test.getExpectedOutput() != null ? test.getExpectedOutput().trim() : "";
            boolean matches = stdout.replaceAll("\\r\\n", "\n").equals(expected.replaceAll("\\r\\n", "\n"));

            if (matches) {
                return new JudgeResult(SubmissionStatus.ACCEPTED, "Accepted", stdout, stdout, runtime, 12000);
            } else {
                return new JudgeResult(SubmissionStatus.WRONG_ANSWER, "Wrong Answer", stdout, "Expected: " + expected + "\nActual: " + stdout, runtime, 12000);
            }
        } catch (Exception e) {
            return new JudgeResult(SubmissionStatus.RUNTIME_ERROR, "Runtime Error", "", e.getMessage(), System.currentTimeMillis() - start, 0);
        }
    }

    private String encode(String value) {
        return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String decode(String value) {
        try {
            return new String(Base64.getDecoder().decode(value), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return value;
        }
    }

    private SubmissionStatus mapStatus(int id) {
        return switch (id) {
            case 3 -> SubmissionStatus.ACCEPTED;
            case 4 -> SubmissionStatus.WRONG_ANSWER;
            case 5 -> SubmissionStatus.TIME_LIMIT;
            case 6 -> SubmissionStatus.COMPILE_ERROR;
            default -> SubmissionStatus.RUNTIME_ERROR;
        };
    }

    public record JudgeResult(
            SubmissionStatus status,
            String description,
            String output,
            String message,
            long executionTime,
            long memory
    ) {}
}