package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.ATSService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/applications")
@CrossOrigin("*")
public class ApplicationController {

    private final ApplicationRepository repo;
    private final CandidateRepository candidateRepo;
    private final JobRepository jobRepo;
    private final ATSService atsService;

    public ApplicationController(ApplicationRepository repo,
                                 CandidateRepository candidateRepo,
                                 JobRepository jobRepo,
                                 ATSService atsService) {
        this.repo = repo;
        this.candidateRepo = candidateRepo;
        this.jobRepo = jobRepo;
        this.atsService = atsService;
    }

    // ── APPLY ────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> apply(@RequestBody Application app) {

        Candidate c = candidateRepo.findByUsername(app.getUsername())
                .orElse(null);
        Job job = jobRepo.findById(app.getJobId()).orElse(null);

        if (c == null || job == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Candidate or Job not found"));
        }

        // Calculate ATS score from resume file vs job description
        int score = 0;
        if (c.getResumePath() != null) {
            score = atsService.calculateScore(
                    c.getResumePath(),
                    job.getDescription() + " " + job.getRequiredSkills()
            );
        }

        app.setStatus("APPLIED");
        app.setAtsScore(score);

        return ResponseEntity.ok(repo.save(app));
    }

    // ── GET ALL (HR sees all) ────────────────────────────
    @GetMapping
    public List<Application> getAll() {
        return repo.findAll();
    }

    // ── GET BY CANDIDATE ────────────────────────────────
    @GetMapping("/my/{username}")
    public List<Application> getMine(@PathVariable String username) {
        return repo.findByUsername(username);
    }

    // ── ATS SCORE (HR triggers manually) ────────────────
    @GetMapping("/ats/{id}")
    public ResponseEntity<?> getAtsScore(@PathVariable Long id) {

        Application app = repo.findById(id).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();

        Candidate c = candidateRepo.findByUsername(app.getUsername()).orElse(null);
        Job job = jobRepo.findById(app.getJobId()).orElse(null);

        if (c == null || job == null || c.getResumePath() == null) {
            return ResponseEntity.status(400)
                    .body(Map.of("message", "Cannot calculate score"));
        }

        int score = atsService.calculateScore(
                c.getResumePath(),
                job.getDescription() + " " + job.getRequiredSkills()
        );

        app.setAtsScore(score);
        repo.save(app);

        return ResponseEntity.ok(Map.of("atsScore", score));
    }

    // ── UPDATE STATUS ────────────────────────────────────
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Application app = repo.findById(id).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();

        app.setStatus(body.get("status"));
        return ResponseEntity.ok(repo.save(app));
    }

    // ── SCHEDULE INTERVIEW ───────────────────────────────
    @PutMapping("/{id}/interview")
    public ResponseEntity<?> scheduleInterview(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Application app = repo.findById(id).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();

        app.setInterviewDate(body.get("interviewDate"));
        app.setInterviewTime(body.get("interviewTime"));
        app.setInterviewVenue(body.get("interviewVenue"));
        app.setInterviewMode(body.get("interviewMode"));
        app.setInterviewLocation(body.get("interviewLocation"));
        app.setStatus("INTERVIEW");

        return ResponseEntity.ok(repo.save(app));
    }
}
