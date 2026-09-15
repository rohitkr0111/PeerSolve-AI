package com.peersolve.service;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import java.util.List;
import com.peersolve.model.Difficulty;
import com.peersolve.model.Problem;
import com.peersolve.repository.ProblemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
@ExtendWith(MockitoExtension.class) class ProblemServiceTest {
 @Mock ProblemRepository repository; @InjectMocks ProblemService service;
 @Test void filtersProblemsByDifficultyTopicAndSearch(){Problem two=problem("Two Sum",Difficulty.EASY,List.of("ARRAY","HASHMAP"));Problem stock=problem("Best Time",Difficulty.EASY,List.of("ARRAY"));Problem subarray=problem("Maximum Subarray",Difficulty.MEDIUM,List.of("ARRAY"));when(repository.findAll()).thenReturn(List.of(two,stock,subarray));assertEquals(1,service.list("easy","hashmap","two").size());assertEquals(2,service.list("EASY",null,null).size());}
 @Test void rejectsUnknownDifficulty(){assertThrows(ResponseStatusException.class,()->service.list("simple",null,null));}
 private Problem problem(String title,Difficulty difficulty,List<String> topics){Problem p=new Problem();p.setTitle(title);p.setDifficulty(difficulty);p.setTopics(topics);return p;}
}
