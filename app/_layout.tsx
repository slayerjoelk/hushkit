import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import { posthog } from "../lib/posthog";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useDeepLink } from "../hooks/useDeepLink";
import "../global.css";

function AppProviders({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { processLink } = useDeepLink();
  usePushNotifications();

  useEffect(() => {
    Purchases.configure({
      apiKey: Platform.OS === "ios"
        ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || ""
        : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || "",
    });
  }, []);

  useEffect(() => {
    if (user?.id) {
      posthog.identify(user.id, { email: user.email });
    } else {
      posthog.reset();
    }
  }, [user]);

  useEffect(() => {
    processLink();
  }, [processLink]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProviders>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0B0F19" } }}>
          <Stack.Screen name="index" options={{ title: "HushKit" }} />
          <Stack.Screen name="auth" options={{ title: "Sign In" }} />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
          <Stack.Screen name="paywall" options={{ title: "Premium", presentation: "modal" }} />
        </Stack>
      </AppProviders>
    </AuthProvider>
  );
}
