import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import Colors from '../constants/Colors';
import { fetchDatenbank, init, insertDatenbank } from '../data/db';

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
  //datenbank wird initialisiert
  init()
    .then(() => {
      console.log('Datenbank wurde initialisiert');
      async function laden() {
        const dbResult = await fetchDatenbank();
        //console.log(dbResult);
        //Falls die Datenbank leer ist, werden die Anfangswerte gesetzt
        if (dbResult.rows.length === 0) {
          console.log('nix drin');
          insertDatenbank('Tinnum', 'grau2', 'gruen4', 'light');
        }
        //console.log(dbResult);
        let eins = dbResult.rows._array[0].ort;
        let zwei = dbResult.rows._array[0].grau;
        let drei = dbResult.rows._array[0].gruen;
        let vier = dbResult.rows._array[0].thema;
        //setMuell([eins, zwei, drei]);
        console.log('Ende laden ' + eins, zwei, drei, vier);
      }
      laden();
      //mal sehen
    })
    .catch((error) => {
      console.log('Datenbank nicht initialisiert');
      console.log(error);
    });

  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await init();
        console.log('Database initialized successfully');
      } catch (err) {
        console.log('Failed to initialize database:', err);
      }
    };

    initializeDatabase();
  }, []);

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
