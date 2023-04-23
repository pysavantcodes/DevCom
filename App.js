import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import AuthProvider from "./contexts/AuthContext";
import CommunityProvider from "./contexts/CommunityContext";
import Main from "./Main";
import GithubProvider from "./contexts/GithubContext";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

export default function App() {
  const theme = {
    colors: {
      ...DefaultTheme.colors,
      secondaryContainer: "rgba(255,255,255,0.2)",
      notification: "red",
    },
  };
  const [fontsLoaded] = useFonts({
    bold: require("./assets/fonts/bold.otf"),
    medium: require("./assets/fonts/medium.otf"),
    regular: require("./assets/fonts/regular.otf"),
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
    <PaperProvider theme={theme}>
      <AuthProvider>
        <CommunityProvider>
          <GithubProvider>
            <Main />
          </GithubProvider>
        </CommunityProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
