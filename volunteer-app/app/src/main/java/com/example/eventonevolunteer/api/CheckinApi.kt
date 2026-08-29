package com.example.eventonevolunteer.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface CheckinApi {
    @POST("/api/v1/checkins")
    suspend fun performCheckIn(
        @Header("Authorization") token: String,
        @Body request: CheckInRequest
    ): Response<CheckInResponse>
}
