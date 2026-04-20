package com.example.demo.dto;

public class RegisterRequest {

    private String username;
    private String password;
    private String fullName;
    private String email;
    private String mobile;
    private String dob;
    private String address;
    private String nationality;
    private String govId;
    private String role;        // ← THIS WAS MISSING

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public String getGovId() { return govId; }
    public void setGovId(String govId) { this.govId = govId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
