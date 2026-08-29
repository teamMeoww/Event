import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function scheduleLocalNotification(title, body, seconds = null) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: seconds ? { seconds, type: 'timeInterval' } : null,
  });
}

// Pre-configured notification types for Phase 11
export const notifyRegistrationSuccess = (eventName) => 
  scheduleLocalNotification('Registration Confirmed', `You are successfully registered for ${eventName}! See you there.`);

export const notifyEventReminder = (eventName) => 
  scheduleLocalNotification('Event Reminder', `${eventName} is starting in 1 hour!`);

export const notifyCheckIn = (eventName) => 
  scheduleLocalNotification('Checked In!', `Welcome to ${eventName}. Enjoy the event!`);

export const notifyCredentialIssued = (credentialTitle) => 
  scheduleLocalNotification('Credential Issued 🏆', `You just earned the ${credentialTitle} Proof of Attendance credential!`);
