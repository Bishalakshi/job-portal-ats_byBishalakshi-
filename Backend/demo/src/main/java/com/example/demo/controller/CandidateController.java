package com.example.demo.controller;

import com.example.demo.entity.Candidate;
import com.example.demo.service.CandidateService;
import com.example.demo.dto.CandidateDTO;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidates")
public class CandidateController {

    private final CandidateService candidateService;

    // Constructor Injection (recommended)
    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    // ✅ CREATE (with validation)
    @PostMapping
    public Candidate createCandidate(@Valid @RequestBody CandidateDTO dto) {

        Candidate candidate = new Candidate();
        candidate.setUsername(dto.getUsername());
        candidate.setPassword(dto.getPassword());
        candidate.setRole(dto.getRole());

        return candidateService.saveCandidate(candidate);
    }

    // ✅ READ ALL
    @GetMapping
    public List<Candidate> getAllCandidates() {
        return candidateService.getAllCandidates();
    }

    // ✅ READ BY ID
    @GetMapping("/{id}")
    public Candidate getCandidateById(@PathVariable Long id) {
        return candidateService.getCandidateById(id);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Candidate updateCandidate(@PathVariable Long id,
                                     @Valid @RequestBody CandidateDTO dto) {

        Candidate candidate = new Candidate();
        candidate.setUsername(dto.getUsername());
        candidate.setPassword(dto.getPassword());
        candidate.setRole(dto.getRole());

        return candidateService.updateCandidate(id, candidate);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
    }
}
