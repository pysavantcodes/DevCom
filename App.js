import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import AuthProvider from "./contexts/AuthContext";
import CommunityProvider from "./contexts/CommunityContext";
import Main from "./Main";
import GithubProvider from "./contexts/GithubContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    bold: require("./assets/fonts/Inter-Bold.ttf"),
    medium: require("./assets/fonts/Inter-Medium.ttf"),
    regular: require("./assets/fonts/Inter-Regular.ttf"),
    code: require("./assets/fonts/Cascadia.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <AuthProvider>
      
      <CommunityProvider>
        <GithubProvider>
        <Main />
        </GithubProvider>
      </CommunityProvider>
    </AuthProvider>
  );
}
