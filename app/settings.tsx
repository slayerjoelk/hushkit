import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ArrowLeft, Bell, Shield, Crown, Palette, LogOut } from "lucide-react-native";
import { useAuth } from "../hooks/useAuth";
import { usePremium } from "../hooks/usePremium";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useDeepLink } from "../hooks/useDeepLink";
import { posthog } from "../lib/posthog";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isPremium } = usePremium();
  const { permissionStatus, requestPermission } = usePushNotifications();
  const { url } = useDeepLink();

  useEffect(() => {
    posthog.capture("settings_viewed");
  }, []);

  const Row = ({ icon: Icon, label, value, onPress, toggle }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-white/5"
    >
      <View className="flex-row items-center">
        <Icon size={18} color="#9CA3AF" />
        <Text className="text-white ml-3 text-base">{label}</Text>
      </View>
      {toggle !== undefined ? (
        <Switch value={toggle} onValueChange={onPress} trackColor={{ false: "#374151", true: "#F59E0B" }} />
      ) : (
        <Text className="text-white/50">{value || "›"}</Text>
      )}
    </TouchableOpacity>
  );
  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-5 pt-4 flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/10 rounded-full">
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-3">Settings</Text>
      </View>
      <ScrollView className="px-5">
        <View className="bg-card rounded-2xl px-4 border border-white/10 mb-4">
          <Row icon={Bell} label="Notifications" value={permissionStatus || "Unknown"} onPress={requestPermission} />
          <Row icon={Shield} label="Biometric Lock" toggle={false} />
          <Row icon={Palette} label="Theme" value="Dark" />
        </View>
        <View className="bg-card rounded-2xl px-4 border border-white/10 mb-4">
          <Row icon={Crown} label="Premium" value={isPremium ? "Active" : "Free"} onPress={() => router.push("/paywall")} />
        </View>
        {url ? (
          <View className="bg-card rounded-2xl p-4 border border-white/10 mb-4">
            <Text className="text-white/40 text-xs font-mono">Deep link: {url}</Text>
          </View>
        ) : null}
        {user ? (
          <TouchableOpacity
            onPress={async () => {
              posthog.capture("settings_sign_out");
              await signOut();
            }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl py-4 items-center mt-2 flex-row justify-center gap-2"
          >
            <LogOut size={18} color="#ef4444" />
            <Text className="text-red-400 font-semibold">Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/auth")}
            className="bg-primary rounded-2xl py-4 items-center mt-2"
          >
            <Text className="text-dark font-bold">Sign In</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
