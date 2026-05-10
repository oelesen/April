import { useState } from 'react';
import {
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
import { useTheme } from '../theme/ThemeContext';

// Korrekter Pfad zu deiner JSON-Datei
import exchangeData from '../data/exchange_rate.json';

const Wechselkurs = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Den Wechselkurs aus der JSON extrahieren
  const exchangeRate = exchangeData.rates.DKK;

  const [dkkValue, setDdkValue] = useState('');
  const [eurValue, setEurValue] = useState('');

  // Funktion: Von DKK zu EUR
  const handleDdkChange = (text) => {
    setDdkValue(text);

    const numericValue = parseFloat(text.replace(',', '.'));

    if (!isNaN(numericValue) && text !== '') {
      const convertedEur = numericValue / exchangeRate;
      setEurValue(convertedEur.toFixed(2).toString());
    } else {
      setEurValue('');
    }
  };

  // Funktion: Von EUR zu DKK
  const handleEurChange = (text) => {
    setEurValue(text);
    const numericValue = parseFloat(text.replace(',', '.'));

    if (!isNaN(numericValue) && text !== '') {
      const convertedDkk = numericValue * exchangeRate;
      setDdkValue(convertedDkk.toFixed(2).toString());
    } else {
      setDdkValue('');
    }
  };

  return (
    // 1. TouchableWithoutFeedback: Schließt das Keyboard beim Tippen auf den Hintergrund
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* 2. KeyboardAvoidingView: Schiebt den Inhalt hoch, wenn das Keyboard erscheint */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* 3. ScrollView: Erlaubt das Scrollen, wenn das Keyboard Platz wegnimmt */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Währungsrechner</Text>
              <Text style={styles.subtitle}>
                Kurs: 1 EUR = {exchangeRate.toFixed(4)} DKK
              </Text>
            </View>

            <View style={styles.converterContainer}>
              {/* Dänische Krone Feld */}
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

              {/* Trenner/Pfeil */}
              <View style={styles.separatorContainer}>
                <View
                  style={[styles.line, { backgroundColor: colors.border }]}
                />
                <Text style={[styles.arrow, { color: colors.primary }]}>⇅</Text>
                <View
                  style={[styles.line, { backgroundColor: colors.border }]}
                />
              </View>

              {/* Euro Feld */}
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

function createStyles(colors) {
  return StyleSheet.create({
    // scrollContent sorgt dafür, dass der Inhalt mittig bleibt, wenn das Keyboard zu ist
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

/*
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const Wechselkurs = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View>
      <Text>wechselkurse</Text>
    </View>
  );
};

export default Wechselkurs;

function createStyles(colors) {
  return StyleSheet.create({});
}
*/
