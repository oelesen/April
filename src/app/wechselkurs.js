import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import useFetch from '../hooks/useFetch';
// Import der benötigten Funktionen aus date-fns für die Zeitformatierung
import { format, fromUnixTime } from 'date-fns'; // Falls Pfad angepasst werden muss, sonst: 'date-fns'
// Hinweis: Falls der Import oben fehlschlägt, nutze: import { format, fromUnixTime } from 'date-fns';
import { useTheme } from '../theme/ThemeContext';

// URL der externen JSON-Datei
const EXCHANGE_RATE_URL = 'https://www.rundf.eu/wechselkurs/exchange_rate.json';

const Wechselkurs = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Abruf der Daten über den useFetch Hook
  const { data: exchangeData, loading, error } = useFetch(EXCHANGE_RATE_URL);

  // Zustände für die Eingabewerte (Dänische Krone und Euro)
  const [dkkValue, setDdkValue] = useState('');
  const [eurValue, setEurValue] = useState('');

  // Der aktuelle Wechselkurs (Sicherer Zugriff auf das DKK-Objekt)
  const exchangeRate = exchangeData?.rates?.DKK;

  /**
   * Hilfsfunktion: Formatiert den Unix-Timestamp aus den API-Daten.
   * Wandelt die Sekunden in ein lesbares Format um: DD.MM.YYYY HH:mm
   * @returns {string} Das formatierte Datum oder ein leerer String bei Fehler.
   */
  const formatTimestamp = () => {
    // Wenn kein Timestamp vorhanden ist, brechen wir ab
    if (!exchangeData?.timestamp) return '';

    try {
      // 1. fromUnixTime wandelt die Sekunden (Unix) in ein JS-Datum um
      // 2. format erstellt den gewünschten String
      return format(fromUnixTime(exchangeData.timestamp), 'dd.MM.yyyy HH:mm');
    } catch (err) {
      // Im Fehlerfall (z.B. ungültiges Format) wird nichts angezeigt
      console.error('Fehler bei der Zeitformatierung:', err);
      return '';
    }
  };

  // --- LOGIK DER UMRECHNUNG ---

  // Funktion: Wenn der DKK-Wert geändert wird -> berechne EUR
  const handleDdkChange = (text) => {
    setDdkValue(text);
    // Ersetze Komma durch Punkt für die mathematische Berechnung
    const numericValue = parseFloat(text.replace(',', '.'));

    if (!isNaN(numericValue) && text !== '') {
      // EUR = DKK / Kurs
      setEurValue((numericValue / exchangeRate).toFixed(2).toString());
    } else {
      setEurValue('');
    }
  };

  // Funktion: Wenn der EUR-Wert geändert wird -> berechne DKK
  const handleEurChange = (text) => {
    setEurValue(text);
    const numericValue = parseFloat(text.replace(',', '.'));

    if (!isNaN(numericValue) && text !== '') {
      // DKK = EUR * Kurs
      setDdkValue((numericValue * exchangeRate).toFixed(2).toString());
    } else {
      setEurValue('');
    }
  };

  // --- RENDERING (UI) ---

  // 1. Ladezustand: Zeige einen Spinner
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>
          Lade Wechselkurs...
        </Text>
      </View>
    );
  }

  // 2. Fehlerzustand: Zeige eine Fehlermeldung
  if (error || !exchangeRate) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          Fehler beim Laden der Daten.
        </Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.understanding === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <View style={styles.container}>
            {/* Header mit Titel, aktuellem Kurs und Datum */}
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Währungsrechner</Text>
              <Text style={styles.subtitle}>
                Kurs: 1 EUR = {exchangeRate.toFixed(4)} DKK
              </Text>

              {/* Anzeige des Datums (nur wenn Timestamp existiert) */}
              {exchangeData?.timestamp && (
                <Text style={styles.dateText}>Stand: {formatTimestamp()}</Text>
              )}
            </View>

            <View style={styles.converterContainer}>
              {/* Eingabefeld: Dänische Krone (DKK) */}
              <View style={styles.inputCard}>
                <Text style={styles.flag}>🇩🇰</Text>
                <View style={styles.inputField}>
                  <Text style={styles.currencyLabel}>DKK</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="0,00"
                    placeholderTextColor={colors.textmuted}
                    keyboardType="numeric"
                    value={dkkValue}
                    onChangeText={handleDdkChange}
                  />
                </View>
              </View>

              {/* Trennelement: Pfeil zwischen den Währungen */}
              <View style={styles.separatorContainer}>
                <View
                  style={[styles.line, { backgroundColor: colors.border }]}
                />
                <Text style={[styles.arrow, { color: colors.primary }]}>⇅</Text>
                <View
                  style={[styles.line, { backgroundColor: colors.border }]}
                />
              </View>

              {/* Eingabefeld: Euro (EUR) */}
              <View style={styles.inputCard}>
                <Text style={styles.flag}>🇪🇺</Text>
                <View style={styles.inputField}>
                  <Text style={styles.currencyLabel}>EUR</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="0,00"
                    placeholderTextColor={colors.textmuted}
                    keyboardType="numeric"
                    value={eurValue}
                    onChangeText={handleEurChange}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Wechselkurs;

/**
 * Styles Definition basierend auf dem Theme
 */
function createStyles(colors) {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: colors.bg,
    },
    container: {
      padding: 25,
      alignItems: 'center',
    },
    headerContainer: {
      marginBottom: 40,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textmuted,
      marginTop: 8,
    },
    dateText: {
      fontSize: 12,
      color: colors.textmuted,
      marginTop: 4,
      fontStyle: 'italic',
    },
    converterContainer: {
      width: '100%',
    },
    inputCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.bglight,
      borderRadius: 20,
      padding: 15,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.bgdark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    flag: {
      fontSize: 35,
      marginRight: 15,
    },
    inputField: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    currencyLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 24,
      fontWeight: '600',
    },
    separatorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 20,
    },
    line: {
      flex: 1,
      height: 1,
      opacity: 0.5,
    },
    arrow: {
      fontSize: 24,
      paddingHorizontal: 15,
      fontWeight: 'bold',
    },
  });
}
