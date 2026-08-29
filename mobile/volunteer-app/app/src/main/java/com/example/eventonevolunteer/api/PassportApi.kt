package com.example.eventonevolunteer.api

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Header

interface PassportApi {
    @GET("/api/v1/passport/me")
    suspend fun getMe(@Header("Authorization") token: String): Response<PassportResponse>
}
