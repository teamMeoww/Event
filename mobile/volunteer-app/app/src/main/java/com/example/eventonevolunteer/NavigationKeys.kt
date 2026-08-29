package com.example.eventonevolunteer

import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable

@Serializable data object Login : NavKey
@Serializable data class Home(val token: String) : NavKey
@Serializable data object Main : NavKey
