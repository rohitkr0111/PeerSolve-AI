package com.peersolve.service.mentor;

import com.peersolve.dto.MentorRequestDto;
import com.peersolve.dto.MentorResponseDto;
import com.peersolve.service.AiMentorService;

import java.util.Collections;
import java.util.List;

/**
 * Rule‑based implementation of {@link MentorAnalysisService}.
 * Analyses code against common Java error patterns and execution output
 * without calling any external LLM. This is also used as the fallback
 * when the LLM service is unavailable.
 */
public class RuleBasedMentorAnalysisService implements MentorAnalysisService {

    private final AiMentorService deterministicService;

    public RuleBasedMentorAnalysisService(AiMentorService deterministicService) {
        this.deterministicService = deterministicService;
    }

    @Override
    public MentorResponseDto analyze(MentorRequestDto request) {
        boolean passed = "ACCEPTED".equalsIgnoreCase(request.getExecutionStatus())
                || "OK".equalsIgnoreCase(request.getExecutionStatus());

        String code = request.getCode() != null ? request.getCode() : "";
        String executionMessage = request.getExecutionMessage();
        int hintsUsed = request.getHintsUsed() != null ? request.getHintsUsed() : 0;

        // Perform pattern‑based analysis without requiring a Mission object.
        // We replicate the core logic from AiMentorService here to avoid NPE
        // when no mission is available (e.g. for standalone problem analysis).
        String diagnosisCode;
        String message;
        String suggestedAction;
        List<String> evidence = Collections.emptyList();

        if (passed) {
            diagnosisCode = "CHALLENGE_SOLVED";
            message = "Outstanding execution! Your solution passed all test cases.";
            if (hintsUsed == 0) {
                message += " Flawless run with zero hints used!";
            }
            suggestedAction = "Consider optimising or refactoring for readability.";
        } else if (executionMessage != null && executionMessage.contains("ArrayIndexOutOfBoundsException")) {
            diagnosisCode = "INDEX_OUT_OF_BOUNDS";
            message = "Index Drift Alert: Your pointer drifted past array boundaries. Remember that in Java, indices span 0 to length - 1.";
            suggestedAction = "Verify loop termination conditions: use < arr.length instead of <= arr.length.";
            evidence = List.of("ArrayIndexOutOfBoundsException detected in output");
        } else if (executionMessage != null && executionMessage.contains("NullPointerException")) {
            diagnosisCode = "NULL_DEREFERENCE";
            message = "Null Collision: You attempted to access properties of an uninstantiated object or missing key.";
            suggestedAction = "Guard lookup results with null checks or use containsKey() before accessing.";
            evidence = List.of("NullPointerException detected in output");
        } else if (executionMessage != null && executionMessage.contains("StackOverflowError")) {
            diagnosisCode = "RECURSION_OVERFLOW";
            message = "Infinite Recursion Vortex: The execution stack exhausted all available frames without hitting a terminating base condition.";
            suggestedAction = "Ensure your base case is explicitly tested at the beginning of the function.";
            evidence = List.of("StackOverflowError detected in output");
        } else if (executionMessage != null && (executionMessage.contains("error:") || executionMessage.contains("cannot find symbol"))) {
            diagnosisCode = "SYNTAX_ANOMALY";
            message = "Compilation Malfunction: Check variable spelling, semicolons, and imported collections (e.g. java.util.*).";
            suggestedAction = "Review the compiler output closely and verify types.";
            evidence = List.of("Compilation error detected in output");
        } else if (containsNestedLoops(code)) {
            diagnosisCode = "QUADRATIC_BOTTLENECK";
            message = "Sensors detect nested iterations (O(N²)). While logically sound on small inputs, this may time‑out on large inputs. Can you store values you've already seen in an auxiliary structure for O(1) checks?";
            suggestedAction = "Consider replacing the inner loop with a HashMap or HashSet lookup.";
            evidence = List.of("Nested loop pattern detected in source code");
        } else {
            diagnosisCode = "INCORRECT_OUTPUT";
            message = "Telemetry mismatch: Your output did not match expected test vectors. Trace variable states step by step with the failing input.";
            suggestedAction = "Inspect the first test case and use the Hint button if you need conceptual direction.";
        }

        MentorResponseDto response = new MentorResponseDto();
        response.setDiagnosisCode(diagnosisCode);
        response.setMessage(message);
        response.setEvidence(evidence);
        response.setSuggestedAction(suggestedAction);
        response.setNextHintTier(null);
        response.setConfidence(null);
        response.setFallbackUsed(true);
        response.setModelVersion(null);
        return response;
    }

    /**
     * Lightweight nested-loop heuristic copied from AiMentorService.
     */
    private boolean containsNestedLoops(String code) {
        int forCount = 0;
        int whileCount = 0;
        String[] lines = code.split("\\r?\\n");
        int depth = 0;
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith("for") || trimmed.contains(" for(") || trimmed.contains(" for (")) {
                forCount++;
                if (forCount >= 2 && depth > 0) return true;
                depth++;
            }
            if (trimmed.startsWith("while") || trimmed.contains(" while(") || trimmed.contains(" while (")) {
                whileCount++;
                if (whileCount >= 2 && depth > 0) return true;
                depth++;
            }
            if (trimmed.contains("}") && depth > 0) {
                depth--;
            }
        }
        return false;
    }
}
