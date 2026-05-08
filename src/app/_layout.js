import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import Colors from '../constants/Colors';

export default function RootLayout() {
  //const router = useRouter();
  const thema = 'light'; // Set the theme to 'light' (you can change this to 'dark' if needed)

  ////////////////////////////////////////////////////////////////
  const [fontsLoaded] = useFonts({
    // Define your custom fonts here
    'roboto-regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf'),
  });
  ///////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (fontsLoaded) {
      // Hide the splash screen after the fonts have loaded and the
      // UI is ready.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  ////////////////////////////////////////////////////////////////

  // Prevent rendering until the font has loaded
  if (!fontsLoaded) {
    return null;
  }
  ////////////////////////////////////////////////////////////////

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[thema].bgdark,
        },
        headerTintColor: Colors[thema].text,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'roboto-bold',
          fontSize: 14,
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  );
}
