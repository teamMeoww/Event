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
