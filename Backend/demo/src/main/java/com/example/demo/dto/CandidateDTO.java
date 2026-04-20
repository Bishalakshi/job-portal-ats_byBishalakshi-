package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CandidateDTO {

    @NotNull(message = "Username cannot be null")
    @Size(min = 3, max = 20, message = "Username must be 3-20 characters")
    private String username;

    @NotNull(message = "Password cannot be null")
    @Size(min = 5, message = "Password must be at least 5 characters")
    private String password;

    @NotNull(message = "Role cannot be null")
    private String role;

    @Email(message = "Invalid email format")
    private String email;

    // getters & setters

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
