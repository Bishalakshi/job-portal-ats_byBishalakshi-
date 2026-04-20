package com.example.demo.controller;

import com.example.demo.config.JwtUtil;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.Candidate;
import com.example.demo.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ── REGISTER ──────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {

        if (candidateRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.status(400)
                    .body(Map.of("message", "Username already exists"));
        }

        Candidate c = new Candidate();
        c.setUsername(req.getUsername());
        c.setPassword(req.getPassword());
        c.setFullName(req.getFullName());
        c.setEmail(req.getEmail());
        c.setMobile(req.getMobile());
        c.setDob(req.getDob());
        c.setAddress(req.getAddress());
        c.setNationality(req.getNationality());
        c.setGovId(req.getGovId());
        c.setRole(req.getRole()); // APPLICANT or HR

        candidateRepository.save(c);

        return ResponseEntity.ok(Map.of("message", "Registered successfully"));
    }

    // ── LOGIN ──────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String username = body.get("username");
        String password = body.get("password");

        Candidate user = candidateRepository.findByUsername(username)
                .orElse(null);

        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(username, user.getRole());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", username,
                "role", user.getRole(),
                "hrVerified", user.isHrVerified()
        ));
    }

    // ── HR VERIFY ──────────────────────────────────────────
    @PostMapping("/hr-verify")
    public ResponseEntity<?> hrVerify(@RequestBody Map<String, String> body) {

        String username = body.get("username");
        String orgName  = body.get("orgName");
        String empId    = body.get("employeeId");

        Candidate hr = candidateRepository.findByUsername(username).orElse(null);

        if (hr == null || !hr.getRole().equals("HR")) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Not an HR account"));
        }

        // Simple verification: both fields must be non-empty
        if (orgName == null || orgName.isBlank() ||
            empId  == null || empId.isBlank()) {
            return ResponseEntity.status(400)
                    .body(Map.of("message", "Org name and Employee ID are required"));
        }

        hr.setOrgName(orgName);
        hr.setEmployeeId(empId);
        hr.setHrVerified(true);
        candidateRepository.save(hr);

        return ResponseEntity.ok(Map.of("message", "HR verified successfully"));
    }

    // ── RESUME UPLOAD ───────────────────────────────────────
    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String username) {

        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            new File(uploadDir).mkdirs();

            String fileName = username + "_" + file.getOriginalFilename();
            String filePath = uploadDir + fileName;

            file.transferTo(new File(filePath));

            // Save resume path to candidate
            candidateRepository.findByUsername(username).ifPresent(c -> {
                c.setResumePath(filePath);
                candidateRepository.save(c);
            });

            return ResponseEntity.ok(Map.of(
                    "message", "Resume uploaded successfully",
                    "filePath", filePath
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }

    // ── RESUME DOWNLOAD ─────────────────────────────────────
    @GetMapping("/resume/{username}")
    public ResponseEntity<?> getResume(@PathVariable String username) {

        Candidate c = candidateRepository.findByUsername(username).orElse(null);

        if (c == null || c.getResumePath() == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Resume not found"));
        }

        File file = new File(c.getResumePath());
        if (!file.exists()) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "File not found on disk"));
        }

        try {
            byte[] bytes = java.nio.file.Files.readAllBytes(file.toPath());
            return ResponseEntity.ok()
                    .header("Content-Disposition",
                            "attachment; filename=\"" + file.getName() + "\"")
                    .header("Content-Type", "application/pdf")
                    .body(bytes);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Download failed"));
        }
    }

    // ── GET CANDIDATE PROFILE ───────────────────────────────
    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username) {

        return candidateRepository.findByUsername(username)
                .map(c -> ResponseEntity.ok((Object) c))
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("message", "User not found")));
    }
}

