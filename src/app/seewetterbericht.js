import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Endpunkt, der den rohen Seewetterbericht als JSON/Text liefert
const API_ENDPOINT = 'https://www.rundf.eu/scraping/seewetterbericht.json';

/**
 * Zeigt den aktuellen Küstenseewetterbericht an.
 * Lädt den Rohtext von der API, extrahiert daraus per Regex
 * den Kopfbereich sowie den Abschnitt "Nordfriesische Küste"
 * und stellt beide in eigenen "Karten" dar.
 */
const Seewetterbericht = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Ladezustand, während der Bericht von der API geholt wird
  const [isLoading, setIsLoading] = useState(false);
  // Rohtext des Seewetterberichts (String, kein Array!)
  const [data, setData] = useState('');
  // Fehlermeldung, falls der API-Aufruf fehlschlägt
  const [error, setError] = useState(null);

  // Lädt den Bericht einmalig beim Mounten der Komponente
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(API_ENDPOINT);

        // API kann sowohl reinen Text als auch ein JSON-Objekt liefern.
        // In beiden Fällen wollen wir am Ende einen String haben.
        let dataArray =
          typeof response.data === 'string'
            ? response.data
            : JSON.stringify(response.data);

        //console.log('dataArray: ', dataArray);
        setData(dataArray);
      } catch (err) {
        // err.message wird gespeichert, damit unten Text angezeigt werden kann
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////
  /**
   * Extrahiert aus dem Gesamttext den Abschnitt "Nordfriesische Küste"
   * bis (exklusiv) zum Beginn von "Elbe von Hamburg bis Cuxhaven".
   *
   * @param {string} text - Rohtext des Seewetterberichts
   * @returns {string} Der gefundene Abschnitt oder ein leerer String
   */
  function extractNordfriesischeKueste(text) {
    // Schutz vor leeren/undefinierten Werten oder falschem Typ (z. B. Array statt String)
    if (!text || typeof text !== 'string') return '';

    const regex =
      /Nordfriesische Küste[\s\S]*?(?=Elbe von Hamburg bis Cuxhaven)/;
    const match = text.match(regex);

    return match ? match[0].trim() : '';
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  /**
   * Extrahiert den einleitenden Kopfbereich des Berichts:
   * von "Küstenseewetterbericht" bis (exklusiv) zum Beginn von
   * "Ostfriesische Küste".
   *
   * @param {string} text - Rohtext des Seewetterberichts
   * @returns {string} Der gefundene Kopfbereich oder ein leerer String
   */
  function extractKopfbereich(text) {
    if (!text || typeof text !== 'string') return '';

    const regex = /Küstenseewetterbericht[\s\S]*?(?=Ostfriesische Küste)/;
    const match = text.match(regex);

    return match ? match[0].trim() : '';
  }
  ///////////////////////////////////////////////////////////////////////////////////////

  // Extrahierte Textbausteine, die auf jedem Render neu berechnet werden,
  // sobald sich `data` ändert (z. B. nach erfolgreichem API-Aufruf)
  const nordfriesischeKueste = extractNordfriesischeKueste(data);
  const kopfbereich = extractKopfbereich(data);

  ///////////////////////////////////////////////////////////////////////////////////////

  // Ladeanzeige: solange geladen wird oder noch keine (verwertbaren) Daten vorliegen
  if (isLoading || !data || data.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.bg} />
      </View>
    );
  }

  // Fehleranzeige, falls der API-Aufruf fehlgeschlagen ist
  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  // Normale Ansicht: Kopfbereich und Nordfriesische Küste je in eigener "Karte"
  return (
    <View style={styles.container}>
      <View style={styles.karte}>
        <Text style={styles.text}>{kopfbereich}</Text>
      </View>
      <View style={styles.karte}>
        <Text style={styles.text}>{nordfriesischeKueste}</Text>
      </View>
    </View>
  );
};

export default Seewetterbericht;

/**
 * Erzeugt die Styles für die Komponente auf Basis des aktuellen
 * Farbschemas (Theme), damit Light-/Dark-Mode korrekt unterstützt wird.
 *
 * @param {object} colors - Farbwerte aus dem ThemeContext
 */
function createStyles(colors) {
  return StyleSheet.create({
    // Äußerer Container: nimmt den gesamten verfügbaren Platz ein
    container: {
      flex: 1,
      backgroundColor: colors.bgdark,
      alignItems: 'center',
    },
    // Kartenartige Box um jeden Textabschnitt (Kopfbereich / Nordfriesische Küste)
    karte: {
      backgroundColor: colors.bglight,
      padding: 20,
      borderRadius: 15,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.border,
      alignItems: 'center',
      marginBottom: 10,
      // Schatten für iOS
      shadowColor: colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      // Schatten für Android
      elevation: 2,
      width: '90%',
    },
    // Textstil innerhalb der Karten
    text: {
      color: colors.text,
      textAlign: 'center',
      fontSize: 14,
    },
  });
}
