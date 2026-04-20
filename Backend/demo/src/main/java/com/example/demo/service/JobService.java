package com.example.demo.service;

import com.example.demo.entity.Job;
import com.example.demo.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    // CREATE
    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }

    // READ ALL
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // READ BY ID
    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElse(null);
    }

    // UPDATE
    public Job updateJob(Long id, Job job) {
        Job existing = jobRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(job.getTitle());
            return jobRepository.save(existing);
        }
        return null;
    }

    // DELETE
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
