import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar'; // Importiere StatusBar für die Icon-Farben
import { useEffect } from 'react';
import {
  fetchDatenbank,
  init,
  insertDatenbank,
  fetchThema,
  updateThema,
} from '../data/db';
import { ThemeProvider, useTheme } from '../theme/ThemeContext'; // Importiere unseren neuen Provider & Hook

/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////
 * APP WRAPPER KOMPONENTE
 * Diese Komponente ist notwendig, weil man den 'useTheme' Hook
 * NUR innerhalb eines 'ThemeProvider' verwenden darf.
 * Wir ziehen sie aus dem RootLayout heraus, um Zugriff auf die Farben zu haben.
 */
function AppWrapper() {
  // Wir holen uns die aktuellen Farben und den Dark-Mode-Status aus unserem Context
  const { colors, isDark } = useTheme();

  return (
    <>
      {/* Die StatusBar passt ihre Icons (Uhrzeit, Akku) automatisch an das Theme an */}
      <StatusBar
        style={isDark ? 'light' : 'dark'}
        // Wir fügen 'animated' hinzu, damit der Übergang nicht so abrupt geschieht
        animated={true}
        // Wir stellen sicher, dass die Transparenz korrekt ist, damit die Icons nicht "verschwinden"
        translucent={true}
        backgroundColor="transparent"
      />

      <Stack
        screenOptions={{
          // Hier nutzen wir nun die dynamischen Farben aus dem Context statt Colors[thema]
          headerStyle: {
            backgroundColor: colors.bgdark, // Nutzt die bgdark Farbe aus deinem Colors-Objekt
          },
          headerTintColor: colors.text, // Nutzt die Textfarbe aus deinem Colors-Objekt
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'roboto-bold',
            fontSize: 14,
            fontWeight: 'bold',
          },
          // WICHTIG: Auch der Hintergrund der Screens sollte dynamisch sein
          contentStyle: {
            backgroundColor: colors.bg, // Nutzt die bg Farbe aus deinem Colors-Objekt
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="themenwahl" options={{ title: 'Dark / Light' }} />
        <Stack.Screen name="wechselkurs" options={{ title: 'Krone / Euro' }} />
        <Stack.Screen name="tide" options={{ title: 'Tidenkalender' }} />
        <Stack.Screen name="basis" options={{ title: 'Basis' }} />
        <Stack.Screen name="apo" options={{ title: 'Apotheke' }} />
        <Stack.Screen
          name="map"
          options={{
            headerTitle: 'Google Maps',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}
/////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * ROOT LAYOUT
 * Dies ist der eigentliche Entry-Point. Hier kümmern wir uns um
 * Fonts, Datenbank und die Bereitstellung des ThemeProviders.
 */
export default function RootLayout() {
  /////////////////////////////
  // 1. FONTS LADEN
  /////////////////////////////
  const [fontsLoaded] = useFonts({
    'roboto-regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf'),
  });

  /////////////////////////////
  // 2. SPLASH SCREEN LOGIK
  /////////////////////////////
  useEffect(() => {
    if (fontsLoaded) {
      // Sobald die Fonts geladen sind, blenden wir den Splash Screen aus
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  /////////////////////////////
  // 3. DATENBANK SETUP
  /////////////////////////////
  useEffect(() => {
    const setup = async () => {
      try {
        // Datenbank initialisieren
        await init();
        console.log('Database is ready!');

        // Prüfen, ob Daten vorhanden sind
        let dbResult = await fetchDatenbank();
        console.log('Daten in der DB:', dbResult);

        // Falls leer: Erst einfügen
        if (dbResult.length === 0) {
          console.log('Datenbank ist leer, setze Anfangswerte...');
          await insertDatenbank('Tinnum', 'grau2', 'gruen4');
          console.log('Anfangswerte erfolgreich eingefügt.');

          // Erneut laden, damit die Variable dbResult aktuell ist
          dbResult = await fetchDatenbank();
        }

        // Thema prüfen und ggf. initialisieren
        let currentTheme = await fetchThema();
        console.log('Aktuelles Theme:', currentTheme);
        if (!currentTheme) {
          console.log('Kein Theme in der DB gefunden, setze Standardwert...');
          await updateThema('light');
        }
      } catch (error) {
        console.error('Fehler beim Setup der Datenbank:', error);
      }
    };
    setup();
  }, []);

  /////////////////////////////
  // 4. RENDERING LOGIK
  /////////////////////////////

  // Verhindere das Rendern, solange die Fonts noch nicht bereit sind
  if (!fontsLoaded) {
    return null;
  }

  return (
    // Wir umschließen die gesamte App mit dem ThemeProvider.
    // Dadurch hat die AppWrapper Komponente Zugriff auf den Theme-Status.
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  );
}
