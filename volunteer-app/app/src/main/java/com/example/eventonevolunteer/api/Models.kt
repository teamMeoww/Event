package com.example.eventonevolunteer.api

data class CheckInRequest(
    val eventId: String,
    val qrToken: String
)

data class CheckInResponse(
    val success: Boolean,
    val code: String,
    val message: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: User
)

data class User(
    val id: String,
    val name: String,
    val email: String,
    val roles: List<String>
)

data class PassportResponse(
    val userId: String,
    val reputationScore: Int,
    val contributions: List<Any>? = null // or whatever structure it has
)
