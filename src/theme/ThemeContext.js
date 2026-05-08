import { createContext, useContext, useState } from 'react'; // Importiere React-Grundfunktionen
import { useColorScheme } from 'react-native'; // Importiere die System-Abfrage von React Native
import colors from '../constants/Colors'; // Importiere deine Farb-Konstante

// Erstelle den Context, in dem wir die Farben und die Steuerung speichern
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Holt die aktuelle Einstellung des Betriebssystems (light oder dark)
  const systemColorScheme = useColorScheme();

  // Der State speichert die manuelle Wahl des Nutzers: 'light', 'dark' oder 'system'
  const [userTheme, setUserTheme] = useState('system');

  // Berechne das aktive Theme-Label ('light' oder 'dark')
  // Wenn 'system' gewählt ist, nimm die System-Einstellung, ansonsten die User-Wahl
  const activeThemeName =
    userTheme === 'system' ? systemColorScheme || 'light' : userTheme;

  // Wähle das tatsächliche Farb-Objekt aus deiner colors.js basierend auf dem aktiven Theme
  // So haben wir direkten Zugriff auf colors.dark oder colors.light
  const activeColors = colors[activeThemeName];

  // Erstelle eine Hilfsvariable, um einfach prüfen zu können, ob wir im Dark Mode sind
  const isDark = activeThemeName === 'dark';

  // Funktion, um das Theme des Nutzers zu ändern
  const setTheme = (newTheme) => {
    setUserTheme(newTheme); // Aktualisiert den State
  };

  // Wir geben alles über den Provider nach unten an die App weiter
  return (
    <ThemeContext.Provider
      value={{
        colors: activeColors, // Das aktuelle Farb-Set (entweder die 'dark' oder 'light' Gruppe)
        isDark, // Ein einfacher Boolean für schnelle Checks
        userTheme, // Die aktuelle Einstellung ('system', 'light' oder 'dark')
        setTheme, // Die Funktion zum Ändern des Themes
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Ein Custom Hook, damit man in Komponenten nur noch 'useTheme()' schreiben muss
export const useTheme = () => {
  const context = useContext(ThemeContext); // Greife auf den Context zu
  if (!context) {
    // Falls man den Hook außerhalb des Providers nutzt, werfen wir einen Fehler
    throw new Error(
      'useTheme muss innerhalb eines ThemeProviders verwendet werden',
    );
  }
  return context; // Gib die Farben und Funktionen zurück
};
