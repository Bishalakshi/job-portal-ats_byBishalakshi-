package com.example.demo.controller;

import com.example.demo.entity.Job;
import com.example.demo.repository.JobRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/jobs")
@CrossOrigin("*")
public class JobController {

    private final JobRepository repo;

    public JobController(JobRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Job> getJobs() {
        return repo.findAll();
    }

    @PostMapping
    public Job addJob(@RequestBody Job job) {
        return repo.save(job);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Job deleted"));
    }
}
