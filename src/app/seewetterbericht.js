import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  // Liefert die Größe der Systembereiche (z. B. Android-Navigationsleiste
  // mit den drei Tasten unten, oder die Home-Indicator-Leiste bei iOS)
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);

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

  /**
   * Fügt vor den Schlüsselwörtern "Wind:", "Sicht/Wetter:" und "Seegang:"
   * sowie vor den Wochentagen (z. B. "Montag:", "Dienstag:") jeweils einen
   * Zeilenumbruch ein, damit der Bericht übersichtlich in einzelnen Zeilen
   * dargestellt wird.
   *
   * @param {string} text - Der zu formatierende Textabschnitt
   * @returns {string} Der formatierte Text mit eingefügten Zeilenumbrüchen
   */
  function formatBerichtText(text) {
    if (!text || typeof text !== 'string') return '';

    return (
      text
        // Vor Wochentagen einen zusätzlichen Zeilenumbruch, um Tage optisch zu trennen
        .replace(
          /\s*(Montag:|Dienstag:|Mittwoch:|Donnerstag:|Freitag:|Samstag:|Sonntag:)/g,
          '\n\n$1',
        )
        // Vor den drei Hauptpunkten jeweils einen Zeilenumbruch einfügen ...
        .replace(/\s*(Wind:)/g, '\n$1')
        .replace(/\s*(Sicht\/Wetter:)/g, '\n$1')
        .replace(/\s*(Seegang:)/g, '\n$1')
        // ... und zusätzlich direkt nach dem Label (nach dem Doppelpunkt),
        // damit der eigentliche Inhalt jeweils in einer eigenen Zeile steht
        .replace(/(Wind:)\s*/g, '$1\n')
        .replace(/(Sicht\/Wetter:)\s*/g, '$1\n')
        .replace(/(Seegang:)\s*/g, '$1\n')
        .trim()
    );
  }
  ///////////////////////////////////////////////////////////////////////////////////////

  // Extrahierte Textbausteine, die auf jedem Render neu berechnet werden,
  // sobald sich `data` ändert (z. B. nach erfolgreichem API-Aufruf)
  const nordfriesischeKueste = formatBerichtText(
    extractNordfriesischeKueste(data),
  );
  const kopfbereich = formatBerichtText(extractKopfbereich(data));

  ///////////////////////////////////////////////////////////////////////////////////////

  // Fehleranzeige, falls der API-Aufruf fehlgeschlagen ist
  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  // Ladeanzeige: solange geladen wird oder noch keine (verwertbaren) Daten vorliegen
  if (isLoading || !data || data.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.bg} />
      </View>
    );
  }

  // Normale Ansicht: Kopfbereich und Nordfriesische Küste je in eigener "Karte".
  // Da der Text länger als der Bildschirm sein kann, wird alles in ein
  // ScrollView gepackt, damit man durch den Bericht scrollen kann.
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <View style={styles.karte}>
        <Text style={styles.text}>{kopfbereich}</Text>
      </View>
      <View style={styles.karte}>
        <Text style={styles.text}>{nordfriesischeKueste}</Text>
      </View>
    </ScrollView>
  );
};

export default Seewetterbericht;

/**
 * Erzeugt die Styles für die Komponente auf Basis des aktuellen
 * Farbschemas (Theme), damit Light-/Dark-Mode korrekt unterstützt wird.
 *
 * @param {object} colors - Farbwerte aus dem ThemeContext
 * @param {object} insets - Sichere-Bereich-Insets (u. a. insets.bottom),
 *                           damit der Inhalt nicht von Systemtasten verdeckt wird
 */
function createStyles(colors, insets) {
  return StyleSheet.create({
    // Äußeres ScrollView: nimmt den gesamten verfügbaren Platz ein
    scrollView: {
      flex: 1,
      backgroundColor: colors.bgdark,
    },
    // contentContainerStyle des ScrollView: wächst nur so hoch wie der Inhalt,
    // damit tatsächlich gescrollt werden kann, statt den Inhalt zu strecken.
    // paddingBottom sorgt zusätzlich dafür, dass der letzte Inhalt nicht von
    // der unteren Systemleiste (z. B. den drei Android-Navigationstasten)
    // verdeckt wird.
    container: {
      flexGrow: 1,
      backgroundColor: colors.bgdark,
      alignItems: 'center',
      paddingVertical: 10,
      paddingBottom: insets.bottom + 5,
    },
    // Kartenartige Box um jeden Textabschnitt (Kopfbereich / Nordfriesische Küste)
    karte: {
      backgroundColor: colors.bglight,
      padding: 3,
      borderRadius: 15,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.border,
      alignItems: 'center',
      marginBottom: 5,
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
      fontFamily: 'roboto-bold',
    },
  });
}
