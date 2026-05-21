import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Zap, Settings, Crown, LogIn, LogOut } from "lucide-react-native";
import { useAuth } from "../hooks/useAuth";
import { usePremium } from "../hooks/usePremium";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { posthog } from "../lib/posthog";

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isPremium } = usePremium();
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    posthog.capture("home_screen_viewed");
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <ScrollView className="px-5 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-white">HushKit</Text>
            {user?.email ? (
              <Text className="text-white/50 text-sm">{user.email}</Text>
            ) : null}
          </View>
          <View className="flex-row items-center gap-2">
            {isPremium ? (
              <View className="bg-primary/20 px-2 py-1 rounded-full">
                <Text className="text-primary text-xs font-semibold">PREMIUM</Text>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              className="p-2 bg-white/10 rounded-full"
            >
              <Settings size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="bg-card rounded-2xl p-5 mb-4 border border-white/10">
          <Text className="text-primary font-semibold mb-1">Welcome</Text>
          <Text className="text-white/80 text-base leading-relaxed">Context-aware notification redaction that auto-hides sensitive previews in public spaces</Text>
        </View>
        {isPremium ? null : (
          <TouchableOpacity
            onPress={() => {
              posthog.capture("paywall_cta_tapped");
              router.push("/paywall");
            }}
            className="bg-primary/20 border border-primary/40 rounded-2xl p-5 mb-4 flex-row items-center"
          >
            <Crown size={24} color="#F59E0B" />
            <View className="ml-3 flex-1">
              <Text className="text-primary font-semibold text-lg">Go Premium</Text>
              <Text className="text-white/70 text-sm">Unlock advanced features and sync.</Text>
            </View>
          </TouchableOpacity>
        )}
        <View className="bg-card rounded-2xl p-5 border border-white/10 mb-4">
          <View className="flex-row items-center mb-2">
            <Zap size={18} color="#F59E0B" />
            <Text className="text-white font-semibold ml-2">Core Feature</Text>
          </View>
          <Text className="text-white/70 text-sm">Mobile app solving privacy and on-device ai are dominant 2026 themes per adjust/appmagic trends with modern privacy UX.</Text>
        </View>
        {expoPushToken ? (
          <View className="bg-card rounded-2xl p-4 border border-white/10 mb-4">
            <Text className="text-white/40 text-xs font-mono">Push token: {expoPushToken.slice(0, 24)}…</Text>
          </View>
        ) : null}
        {user ? (
          <TouchableOpacity
            onPress={async () => {
              posthog.capture("sign_out_tapped");
              await signOut();
            }}
            className="bg-white/5 border border-white/10 rounded-2xl py-4 items-center flex-row justify-center gap-2"
          >
            <LogOut size={18} color="#fff" />
            <Text className="text-white font-semibold">Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              posthog.capture("sign_in_cta_tapped");
              router.push("/auth");
            }}
            className="bg-primary rounded-2xl py-4 items-center flex-row justify-center gap-2"
          >
            <LogIn size={18} color="#0B0F19" />
            <Text className="text-dark font-bold">Sign In</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
