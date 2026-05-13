import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// WICHTIG: Importiere den Hook aus deinem ThemeContext
import { useTheme } from '../theme/ThemeContext';

const ThemeCheckerComponent = () => {
  // Wir holen uns alles, was wir brauchen:
  // Die Farben, den Status (isDark) und die Funktion zum Ändern (setTheme)
  const { colors, userTheme, setTheme } = useTheme();

  return (
    // Wir nutzen colors.bg als Hintergrund für den gesamten Screen
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Titel-Bereich */}
      <Text style={[styles.title, { color: colors.text }]}>Theme Control</Text>

      <Text style={[styles.subtitle, { color: colors.textmuted }]}>
        Aktuelle Einstellung:{' '}
        <Text style={{ fontWeight: 'bold' }}>{userTheme}</Text>
      </Text>

      {/* Eine Info-Card, die zeigt, wie man die Farben nutzt */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.bglight, // Nutzt die hellere Hintergrundfarbe
            borderColor: colors.border, // Nutzt die Rahmenfarbe
            borderWidth: 1,
          },
        ]}
      >
        <Text style={[styles.cardText, { color: colors.primary }]}>
          Primärfarbe Test
        </Text>
        <Text style={[styles.cardText, { color: colors.secondary }]}>
          Sekundärfarbe Test
        </Text>
        <Text style={[styles.cardText, { color: colors.danger }]}>
          Danger-Farbe Test
        </Text>
      </View>

      {/* Bereich für die Buttons (Interaktion) */}
      <View style={styles.buttonContainer}>
        {/* Button: Light Mode */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setTheme('light')}
        >
          <Text style={[styles.buttonText, { color: colors.bg }]}>
            Light Mode
          </Text>
        </TouchableOpacity>

        {/* Button: Dark Mode */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setTheme('dark')}
        >
          <Text style={[styles.buttonText, { color: colors.bg }]}>
            Dark Mode
          </Text>
        </TouchableOpacity>

        {/* Button: System Default */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.border }]}
          onPress={() => setTheme('system')}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            System Default
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Die Styles sind jetzt nur noch für das Layout (Abstände, Größe) zuständig
// Die Farben kommen dynamisch von oben!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 40,
    // Schatten für iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Schatten für Android
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ThemeCheckerComponent;
