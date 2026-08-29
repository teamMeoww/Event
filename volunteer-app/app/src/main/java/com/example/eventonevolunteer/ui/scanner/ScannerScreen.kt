package com.example.eventonevolunteer.ui.scanner

import android.Manifest
import android.util.Log
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.example.eventonevolunteer.api.CheckInRequest
import com.example.eventonevolunteer.api.RetrofitClient
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import kotlinx.coroutines.launch
import java.util.concurrent.Executors

@Composable
fun ScannerScreen() {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val coroutineScope = rememberCoroutineScope()

    var hasCameraPermission by remember { mutableStateOf(false) }
    var isProcessing by remember { mutableStateOf(false) }
    var lastScannedToken by remember { mutableStateOf<String?>(null) }
    var scanResultText by remember { mutableStateOf("Scan a ticket") }

    val cameraPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        hasCameraPermission = isGranted
    }

    LaunchedEffect(Unit) {
        cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
    }

    if (!hasCameraPermission) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("Camera permission is required.")
        }
        return
    }

    Box(modifier = Modifier.fillMaxSize()) {
        AndroidView(
            modifier = Modifier.fillMaxSize(),
            factory = { ctx ->
                val previewView = PreviewView(ctx).apply {
                    layoutParams = ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                }

                val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                cameraProviderFuture.addListener({
                    val cameraProvider = cameraProviderFuture.get()
                    val preview = Preview.Builder().build().also {
                        it.setSurfaceProvider(previewView.surfaceProvider)
                    }

                    val imageAnalyzer = ImageAnalysis.Builder()
                        .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                        .build()

                    val scanner = BarcodeScanning.getClient()
                    val executor = Executors.newSingleThreadExecutor()

                    imageAnalyzer.setAnalyzer(executor) { imageProxy ->
                        val mediaImage = imageProxy.image
                        if (mediaImage != null && !isProcessing) {
                            val image = InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)
                            scanner.process(image)
                                .addOnSuccessListener { barcodes ->
                                    for (barcode in barcodes) {
                                        val rawValue = barcode.rawValue
                                        if (rawValue != null && rawValue != lastScannedToken) {
                                            lastScannedToken = rawValue
                                            isProcessing = true
                                            scanResultText = "Processing ticket..."
                                            
                                            // Send to backend
                                            coroutineScope.launch {
                                                try {
                                                    val request = CheckInRequest("evt_123456", rawValue)
                                                    val response = RetrofitClient.checkinApi.performCheckIn("Bearer volunteer123", request)
                                                    if (response.isSuccessful && response.body()?.success == true) {
                                                        scanResultText = "✅ Success!"
                                                        Toast.makeText(context, "Checked in successfully!", Toast.LENGTH_SHORT).show()
                                                    } else {
                                                        val msg = response.body()?.message ?: "Check-in failed"
                                                        scanResultText = "❌ $msg"
                                                        Toast.makeText(context, msg, Toast.LENGTH_LONG).show()
                                                    }
                                                } catch (e: Exception) {
                                                    Log.e("Scanner", "API Error", e)
                                                    scanResultText = "❌ Error connecting to server"
                                                    Toast.makeText(context, "Network error", Toast.LENGTH_SHORT).show()
                                                } finally {
                                                    // Allow next scan after 3 seconds
                                                    kotlinx.coroutines.delay(3000)
                                                    isProcessing = false
                                                    scanResultText = "Scan a ticket"
                                                    lastScannedToken = null
                                                }
                                            }
                                            break // Process one barcode at a time
                                        }
                                    }
                                }
                                .addOnCompleteListener {
                                    imageProxy.close()
                                }
                        } else {
                            imageProxy.close()
                        }
                    }

                    val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
                    try {
                        cameraProvider.unbindAll()
                        cameraProvider.bindToLifecycle(
                            lifecycleOwner,
                            cameraSelector,
                            preview,
                            imageAnalyzer
                        )
                    } catch (e: Exception) {
                        Log.e("ScannerScreen", "Use case binding failed", e)
                    }
                }, ContextCompat.getMainExecutor(ctx))
                
                previewView
            }
        )

        // Overlay UI
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(32.dp)
        ) {
            Button(onClick = { /* Reset explicitly if needed */ }) {
                if (isProcessing) {
                    CircularProgressIndicator(modifier = Modifier.padding(end = 8.dp), color = androidx.compose.ui.graphics.Color.White)
                }
                Text(scanResultText)
            }
        }
    }
}
