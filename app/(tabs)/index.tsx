import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-5xl font-sans-extrabold">
        Home
      </Text>
      <Link href="/onboarding" className="mt-4 font-sans-extrabold rounded bg-primary text-white p-4">Go to Onboarding</Link>
      <Link href="/(auth)/signin" className="mt-4 font-sans-extrabold rounded bg-primary text-white p-4">Sign In</Link>
      <Link href="/(auth)/signup" className="mt-4 font-sans-extrabold rounded bg-primary text-white p-4">Sign Up</Link>
    </SafeAreaView>
  );
}