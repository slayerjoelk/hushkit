import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react-native";
import { useAuth } from "../hooks/useAuth";
import { posthog } from "../lib/posthog";

export default function AuthScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const sendMagicLink = async () => {
    if (!email || loading) return;
    setLoading(true);
    try {
      posthog.capture("sign_in_attempted", { method: "magic_link" });
      await signIn(email);
      setSent(true);
    } catch (e) {
      console.error("Magic link failed", e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-dark">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="px-5 pt-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/10 rounded-full">
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold ml-3">Sign In</Text>
        </View>
        <View className="flex-1 justify-center px-5">
          <Text className="text-white text-2xl font-bold mb-2">Welcome back</Text>
          <Text className="text-white/60 mb-8">Enter your email and we'll send you a magic link.</Text>
          <View className="bg-card rounded-xl px-4 py-3 border border-white/10 flex-row items-center mb-4">
            <Mail size={18} color="#9CA3AF" />
            <TextInput
              className="flex-1 text-white ml-3"
              placeholder="you@example.com"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <TouchableOpacity onPress={sendMagicLink} className="bg-primary rounded-xl py-4 items-center">
            <Text className="text-dark font-bold text-base">{loading ? "Sending…" : sent ? "Check your inbox" : "Send Magic Link"}</Text>
          </TouchableOpacity>
          {sent && (
            <Text className="text-green-400 text-center mt-4">
              Magic link sent! Open it on this device to sign in.
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
