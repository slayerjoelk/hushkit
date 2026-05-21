import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Check, Crown, X } from "lucide-react-native";
import { usePremium } from "../hooks/usePremium";
import { posthog } from "../lib/posthog";

const features = [
  "Unlimited entries & sync",
  "Priority support",
  "Advanced analytics",
  "Export to CSV / PDF",
  "Biometric lock",
];

export default function PaywallScreen() {
  const router = useRouter();
  const { isPremium, loading, packages, purchase, restore } = usePremium();

  useEffect(() => {
    posthog.capture("paywall_viewed");
  }, []);

  const handlePurchase = async (pkg: any) => {
    posthog.capture("purchase_attempted", { package: pkg.identifier });
    await purchase(pkg);
    posthog.capture("purchase_completed", { package: pkg.identifier });
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-5 pt-4 flex-row items-center justify-between">
        <Text className="text-white text-lg font-semibold">Go Premium</Text>
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/10 rounded-full">
          <X size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5 pt-6">
        <View className="items-center mb-6">
          <View className="bg-primary/20 p-4 rounded-full mb-3">
            <Crown size={32} color="#F59E0B" />
          </View>
          <Text className="text-white text-2xl font-bold mb-1">Unlock HushKit Pro</Text>
          <Text className="text-white/60 text-center">Get the most out of your app.</Text>
        </View>

        {isPremium ? (
          <View className="bg-primary/20 border border-primary rounded-2xl p-6 mb-6 items-center">
            <Crown size={40} color="#F59E0B" />
            <Text className="text-white text-xl font-bold mt-3">You're Premium!</Text>
            <Text className="text-white/60 text-center mt-1">Thanks for supporting the app.</Text>
          </View>
        ) : loading ? (
          <Text className="text-white/50 text-center mb-6">Loading plans…</Text>
        ) : packages.length === 0 ? (
          <Text className="text-white/50 text-center mb-6">No plans available.</Text>
        ) : (
          packages.map((pkg, i) => (
            <TouchableOpacity
              key={pkg.identifier || i}
              onPress={() => handlePurchase(pkg)}
              className="bg-card rounded-2xl p-4 mb-3 border border-white/10 flex-row items-center justify-between"
            >
              <View>
                <Text className="text-base font-semibold text-white">{pkg.product.title || pkg.packageType}</Text>
                <Text className="text-white/50 text-sm">{pkg.product.description}</Text>
              </View>
              <Text className="text-primary text-lg font-bold">{pkg.product.priceString}</Text>
            </TouchableOpacity>
          ))
        )}

        {!isPremium && (
          <View className="bg-card rounded-2xl p-5 border border-white/10 mt-2 mb-6">
            {features.map((f, i) => (
              <View key={i} className="flex-row items-center py-2">
                <Check size={16} color="#22C55E" />
                <Text className="text-white/80 ml-3 text-sm">{f}</Text>
              </View>
            ))}
          </View>
        )}

        {!isPremium && (
          <TouchableOpacity onPress={restore} className="border border-white/10 rounded-2xl py-4 items-center mb-4">
            <Text className="text-white/60 font-semibold text-base">Restore Purchases</Text>
          </TouchableOpacity>
        )}

        <Text className="text-white/40 text-xs text-center mb-6">
          Subscriptions auto-renew. Manage in Settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}