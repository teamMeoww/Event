package com.example.eventonevolunteer.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.eventonevolunteer.api.RetrofitClient
import com.example.eventonevolunteer.theme.*
import kotlinx.coroutines.launch
import androidx.compose.ui.graphics.Color

@Composable
fun HomeScreen(token: String, onStartScanning: () -> Unit) {
    var volunteerName by remember { mutableStateOf("Volunteer") }
    var scanCount by remember { mutableStateOf(0) }
    var isLoading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(token) {
        coroutineScope.launch {
            try {
                // Fetch volunteer stats (mocking scan count via reputation score or setting to 0)
                val response = RetrofitClient.passportApi.getMe("Bearer $token")
                if (response.isSuccessful) {
                    val body = response.body()
                    if (body != null) {
                        // Assuming the userId can be mapped to name or we fetch user info.
                        // Here we just use the ID or mock it since there is no 'name' in PassportResponse
                        volunteerName = body.userId
                        scanCount = body.reputationScore // Using reputation score as mock scan count
                    }
                } else {
                    error = "Failed to load data: ${response.code()}"
                }
            } catch (e: Exception) {
                error = "Network Error"
            } finally {
                isLoading = false
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Background)
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center),
                color = Primary
            )
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp)
            ) {
                Spacer(modifier = Modifier.height(24.dp))
                
                Text(
                    text = "Hello, $volunteerName",
                    color = TextPrimary,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold
                )
                
                Text(
                    text = "Ready to scan?",
                    color = TextSecondary,
                    fontSize = 16.sp
                )

                Spacer(modifier = Modifier.height(32.dp))

                if (error != null) {
                    Text(text = error ?: "", color = ErrorColor)
                    Spacer(modifier = Modifier.height(16.dp))
                }

                // GlassCard style stats box
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(SurfaceLight)
                        .border(1.dp, Border, RoundedCornerShape(16.dp))
                        .padding(vertical = 24.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(
                        modifier = Modifier.weight(1f),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = scanCount.toString(),
                            color = Primary,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Scans",
                            color = TextSecondary,
                            fontSize = 14.sp
                        )
                    }
                    
                    Box(
                        modifier = Modifier
                            .width(1.dp)
                            .height(40.dp)
                            .background(BorderLight)
                    )
                    
                    Column(
                        modifier = Modifier.weight(1f),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "1", // Mock event count
                            color = Primary,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Events",
                            color = TextSecondary,
                            fontSize = 14.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.weight(1f))

                Button(
                    onClick = onStartScanning,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Primary),
                    shape = RoundedCornerShape(28.dp)
                ) {
                    Text("Start Scanning", color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
