import { Platform } from "react-native";
import Purchases from "react-native-purchases";

export function configurePurchases() {
  Purchases.configure({
    apiKey: Platform.OS === "ios" ? "appl_your_ios_key" : "goog_your_android_key",
  });
}

export { Purchases };
