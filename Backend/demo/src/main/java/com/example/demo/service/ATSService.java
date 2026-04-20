package com.example.demo.service;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class ATSService {

    public int calculateScore(String resumePath, String jobDescription) {
        try {
            Tika tika = new Tika();

            String resumeText = tika.parseToString(new File(resumePath)).toLowerCase();
            jobDescription = jobDescription.toLowerCase();

            int score = 0;

            String[] words = jobDescription.split(" ");
            int match = 0;

            for (String w : words) {
                if (resumeText.contains(w)) match++;
            }

            score += Math.min(60, match);

            if (resumeText.length() > 1000) score += 20;
            if (resumeText.contains("skill")) score += 10;
            if (resumeText.contains("experience")) score += 10;

            return score;

        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}
