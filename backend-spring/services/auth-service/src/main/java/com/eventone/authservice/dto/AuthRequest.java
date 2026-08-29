package com.eventone.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthRequest {
    public static class Login {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class Register {
        @NotBlank
        private String name;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 6)
        private String password;
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
