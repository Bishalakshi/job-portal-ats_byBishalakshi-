package com.example.demo.service;

import com.example.demo.entity.Candidate;
import com.example.demo.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    // CREATE
    public Candidate saveCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    // READ ALL
    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    // READ BY ID (FIXED - NO OPTIONAL)
    public Candidate getCandidateById(Long id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + id));
    }

    // UPDATE
    public Candidate updateCandidate(Long id, Candidate updatedCandidate) {

        Candidate existing = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + id));

        existing.setUsername(updatedCandidate.getUsername());
        existing.setPassword(updatedCandidate.getPassword());

        return candidateRepository.save(existing);
    }

    // DELETE
    public void deleteCandidate(Long id) {
        candidateRepository.deleteById(id);
    }
}
