package com.peersolve.config;
import java.time.Instant;
import java.util.List;
import com.peersolve.model.*;
import com.peersolve.repository.ProblemRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration public class ProblemDataSeeder {
 @Bean ApplicationRunner seedProblems(ProblemRepository repo){return args->{if(repo.count()>0)return; repo.saveAll(List.of(
  p("Two Sum",Difficulty.EASY,List.of("ARRAY","HASHMAP"),"Given an integer array and a target, return the indices of two values whose sum equals the target.","3 7 11 15\n9","0 1",List.of("Exactly one answer exists."),"O(n)","O(n)"),
  p("Best Time to Buy and Sell Stock",Difficulty.EASY,List.of("ARRAY"),"Choose one day to buy and a later day to sell stock for the maximum profit.","7 1 5 3 6 4","5",List.of("You may not sell before buying."),"O(n)","O(1)"),
  p("Contains Duplicate",Difficulty.EASY,List.of("ARRAY","HASHMAP"),"Return true when any value appears at least twice in the array.","1 2 3 1","true",List.of("Array values are integers."),"O(n)","O(n)"),
  p("Maximum Subarray",Difficulty.MEDIUM,List.of("ARRAY","DYNAMIC_PROGRAMMING"),"Find the contiguous subarray with the largest sum.","-2 1 -3 4 -1 2 1 -5 4","6",List.of("The array has at least one number."),"O(n)","O(1)"),
  p("Move Zeroes",Difficulty.EASY,List.of("ARRAY","TWO_POINTERS"),"Move all zeroes to the end while preserving the order of non-zero elements.","0 1 0 3 12","1 3 12 0 0",List.of("Modify the array in place."),"O(n)","O(1)"),
  p("Valid Anagram",Difficulty.EASY,List.of("STRING","HASHMAP"),"Return true if two lowercase strings are anagrams of each other.","anagram\nnagaram","true",List.of("Strings contain lowercase English letters."),"O(n)","O(1)"),
  p("Valid Palindrome",Difficulty.EASY,List.of("STRING","TWO_POINTERS"),"Determine whether a string is a palindrome after removing non-alphanumeric characters.","A man, a plan, a canal: Panama","true",List.of("Ignore case."),"O(n)","O(1)"),
  p("Reverse Linked List",Difficulty.EASY,List.of("LINKED_LIST"),"Reverse a singly linked list and return its head.","1 2 3 4 5","5 4 3 2 1",List.of("The list may be empty."),"O(n)","O(1)"),
  p("Merge Two Sorted Lists",Difficulty.EASY,List.of("LINKED_LIST"),"Merge two sorted linked lists into one sorted list.","1 2 4\n1 3 4","1 1 2 3 4 4",List.of("Both input lists are sorted."),"O(n+m)","O(1)"),
  p("Binary Search",Difficulty.EASY,List.of("BINARY_SEARCH","ARRAY"),"Find the index of target in a sorted integer array, or return -1.","-1 0 3 5 9 12\n9","4",List.of("Input array is sorted in ascending order."),"O(log n)","O(1)"),
  p("Search Insert Position",Difficulty.EASY,List.of("BINARY_SEARCH","ARRAY"),"Return the index where target exists or should be inserted in sorted order.","1 3 5 6\n5","2",List.of("Input array has distinct values."),"O(log n)","O(1)")
  ));};}
 private Problem p(String title,Difficulty difficulty,List<String> topics,String description,String input,String output,List<String> constraints,String time,String space){Problem p=new Problem();p.setTitle(title);p.setDifficulty(difficulty);p.setTopics(topics);p.setDescription(description);p.setExamples(List.of(new ProblemExample(input,output,"Use standard input and print the expected output.")));p.setConstraints(constraints);p.setStarterCode("import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // Read from standard input and print your answer.\n        // See the example for the input format.\n    }\n}\n");p.setTestCases(List.of(new TestCase(input,output)));p.setExpectedTimeComplexity(time);p.setExpectedSpaceComplexity(space);p.setCreatedAt(Instant.now());return p;}
}
