package com.example.eventonevolunteer.ui.login

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.eventonevolunteer.api.LoginRequest
import com.example.eventonevolunteer.api.RetrofitClient
import com.example.eventonevolunteer.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(onLoginSuccess: (String) -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var error by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()

    val handleLogin: () -> Unit = {
        if (email.isBlank() || password.isBlank()) {
            error = "Please fill in all fields"
        } else {
            error = ""
            isLoading = true
            coroutineScope.launch {
                try {
                    val response = RetrofitClient.authApi.login(LoginRequest(email, password))
                    if (response.isSuccessful) {
                        val body = response.body()
                        if (body != null) {
                            onLoginSuccess(body.token)
                        } else {
                            error = "Login failed: empty response"
                        }
                    } else {
                        error = "Login failed: ${response.code()}"
                    }
                } catch (e: Exception) {
                    error = e.message ?: "Network error"
                } finally {
                    isLoading = false
                }
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(colors = listOf(Color(0xFF1A1A2E), Background)))
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Logo placeholder
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .background(Color(0x1A8C8CFF), shape = RoundedCornerShape(40.dp))
                    .border(1.dp, Color(0x338C8CFF), shape = RoundedCornerShape(40.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text("∞", color = Primary, fontSize = 40.sp)
            }

            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "EventOne",
                color = TextPrimary,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold
            )
            
            Text(
                text = "Welcome back",
                color = TextSecondary,
                fontSize = 16.sp
            )

            Spacer(modifier = Modifier.height(48.dp))

            if (error.isNotEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0x1AEF4444), shape = RoundedCornerShape(8.dp))
                        .padding(16.dp)
                ) {
                    Text(text = error, color = ErrorColor, fontSize = 14.sp)
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Email", color = TextSecondary) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = SurfaceLight,
                    unfocusedContainerColor = SurfaceLight,
                    unfocusedBorderColor = Border,
                    focusedBorderColor = Primary,
                    cursorColor = Primary,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                ),
                shape = RoundedCornerShape(12.dp),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Password", color = TextSecondary) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = SurfaceLight,
                    unfocusedContainerColor = SurfaceLight,
                    unfocusedBorderColor = Border,
                    focusedBorderColor = Primary,
                    cursorColor = Primary,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                ),
                shape = RoundedCornerShape(12.dp),
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
            )

            Spacer(modifier = Modifier.height(32.dp))

            Button(
                onClick = handleLogin,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Primary),
                shape = RoundedCornerShape(28.dp),
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(color = TextPrimary, modifier = Modifier.size(24.dp))
                } else {
                    Text("Sign In", color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
