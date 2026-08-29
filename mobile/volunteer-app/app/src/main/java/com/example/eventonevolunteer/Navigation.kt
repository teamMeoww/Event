package com.example.eventonevolunteer

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import com.example.eventonevolunteer.ui.scanner.ScannerScreen
import com.example.eventonevolunteer.ui.login.LoginScreen
import com.example.eventonevolunteer.ui.home.HomeScreen

@Composable
fun MainNavigation() {
  val backStack = rememberNavBackStack(Login) // start at Login

  NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider =
      entryProvider {
        entry<Login> {
          LoginScreen(onLoginSuccess = { token ->
              backStack.add(Home(token))
          })
        }
        entry<Home> { home ->
            HomeScreen(token = home.token, onStartScanning = {
                backStack.add(Main)
            })
        }
        entry<Main> {
          ScannerScreen()
        }
      },
  )
}
