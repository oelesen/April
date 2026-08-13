import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
//import Colors from '../constants/Colors';
import useAbfrageSCN from '../hooks/useAbfrageSCN';
import { format } from 'date-fns';
import Truppe from '../components/scn_namen';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

const SCN = () => {
  // Aktuelle Farbwerte aus dem Theme-Context holen und daraus die Styles bauen
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Daten, Ladezustand, Fehler und die refetch-Funktion aus dem Custom Hook
  const { data, update, isLoading, error, refetch } = useAbfrageSCN();
  ///////////////////////////////////////////////////////////////////////////////////////

  // Prüft, ob dieser Screen gerade im Fokus ist (z. B. beim Wechsel zwischen Tabs)
  const isFocused = useIsFocused();

  // Damit die Daten immer aktualisiert werden:
  // Sobald der Screen wieder in den Fokus kommt, werden die Daten neu geladen.
  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]); // keine refetch-Abhängigkeit hier, da refetch bei jedem Render
  // neu erzeugt wird und sonst eine Endlosschleife entstehen könnte

  ////////////////////////////////////////////////////////////////////////////////////
  // Wir ändern die Definition von 'wann' so, dass sie prüft, ob 'update' existiert
  // und ob der Wert als Datum gültig ist, bevor es formatiert wird.

  let wann = '';
  if (update && update !== '') {
    const dateObj = new Date(update);
    if (!isNaN(dateObj.getTime())) {
      // update ist ein gültiges Datum -> formatieren als "Daten Stand / Jetzt"
      wann =
        format(dateObj, 'dd.MM.yyyy HH:mm') +
        '/' +
        format(new Date(), 'dd.MM.yyyy HH:mm');
    } else {
      // update enthält einen Wert, der sich aber nicht in ein Datum umwandeln lässt
      wann = 'Unbekannt';
    }
  } else {
    // update ist noch leer, z. B. weil der Request noch läuft
    wann = 'Lädt...';
  }
  ////////////////////////////////////////////////////////////////////////////////////
  // hier wird der Tabellenkopf geschrieben
  const Head = () => {
    return (
      <>
        {/* Überschrift der Tabelle / Liga-Bezeichnung */}
        <View style={styles.kopfzeile}>
          <Text style={styles.text}>Kreisklasse A 1</Text>
        </View>

        {/* Kopfzeile mit den Spaltentiteln */}
        <View style={styles.reiheOben}>
          <Text style={{ ...styles.kasten1, ...styles.titel }}>Rg</Text>
          <Text style={{ ...styles.kasten2, ...styles.titel }}>Team</Text>
          <Text style={{ ...styles.kasten3, ...styles.titel }}>Pt</Text>
          <Text style={{ ...styles.kasten4, ...styles.titel }}>Tore</Text>
          <Text style={{ ...styles.kasten5, ...styles.titel }}>Sp</Text>
        </View>
      </>
    );
  };
  /////////////////////////////////////////////////////////////////////////////////////
  // hier wird der Tabellenfuß geschrieben
  const Foot = () => {
    return (
      <>
        {/* Fußzeile mit dem Datenstand */}
        <View style={styles.fusszeile}>
          <Text style={styles.fusstext}>Daten Stand: {wann}</Text>
        </View>
      </>
    );
  };
  /////////////////////////////////////////////////////////////////////////////////////
  // Rendert eine einzelne Tabellenzeile, abhängig von Rang (gerade/ungerade)
  // und ob es sich um den eigenen Verein (SC Norddörfer) handelt
  const Renderliste = ({ item }) => {
    // Gerade Tabellenzeilen (außer SC Norddörfer) -> etwas anderer Hintergrund
    if (item.id % 2 === 0 && item.verein !== 'SC Norddörfer') {
      return (
        <View style={{ ...styles.reihe, ...styles.mittel }}>
          <Text style={styles.kasten1}>{item.rang}</Text>
          <Text style={styles.kasten2}>
            <Truppe name={item.verein} />
          </Text>
          <Text style={styles.kasten3}>{item.punkte}</Text>
          <Text style={styles.kasten4}>
            {item.torverhaeltnis} ({item.tordifferenz})
          </Text>
          <Text style={styles.kasten5}>{item.spiele}</Text>
        </View>
      );
    }

    // Ungerade Tabellenzeilen (außer SC Norddörfer) -> Standard-Hintergrund
    if (item.id % 2 !== 0 && item.verein !== 'SC Norddörfer') {
      return (
        <View style={styles.reihe}>
          <Text style={styles.kasten1}>{item.rang}</Text>
          <Text style={styles.kasten2}>
            <Truppe name={item.verein} />
          </Text>
          <Text style={styles.kasten3}>{item.punkte}</Text>
          <Text style={styles.kasten4}>
            {item.torverhaeltnis} ({item.tordifferenz})
          </Text>
          <Text style={styles.kasten5}>{item.spiele}</Text>
        </View>
      );
    }

    // Zeile des eigenen Vereins (SC Norddörfer) -> optisch hervorgehoben
    if (item.verein === 'SC Norddörfer') {
      return (
        <View style={{ ...styles.reihe, ...styles.scn }}>
          <Text style={styles.kasten1}>{item.rang}</Text>
          <Text style={styles.kasten2}>
            <Truppe name={item.verein} />
          </Text>
          <Text style={styles.kasten3}>{item.punkte}</Text>
          <Text style={styles.kasten4}>
            {item.torverhaeltnis} ({item.tordifferenz})
          </Text>
          <Text style={styles.kasten5}>{item.spiele}</Text>
        </View>
      );
    }

    // Fallback: keiner der obigen Fälle trifft zu -> nichts rendern
    return null;
  };
  ////////////////////////////////////////////////////////////////////////////////////
  // Solange die Daten laden, nur einen Ladeindikator anzeigen
  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Falls beim Laden ein Fehler aufgetreten ist, Fehlermeldung statt Tabelle anzeigen
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Fehler beim Laden der Tabelle. Bitte versuche es später erneut.
        </Text>
      </View>
    );
  }

  // Normalfall: Tabelle mit Kopf, Datenzeilen und Fußzeile (Datenstand) darstellen
  return (
    <View style={styles.container}>
      <Head />
      <View style={styles.tabelle}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Renderliste item={item} />}
        />
      </View>
      <Foot />
    </View>
  );
};

export default SCN;
////////////////////////////////////////////////////////////////////////////
// Erzeugt alle Styles der Komponente abhängig vom aktuellen Farbschema (Theme)
function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bgdark,
    },
    text: {
      fontSize: 16,
      color: colors.text,
    },
    tabelle: {
      marginTop: 10,
      marginBottom: 10,
      width: '96%',
      flex: 1,
      // aktuell keine weiteren Style-Vorgaben aktiv
    },
    kopfzeile: {
      // Layout der Kopfzeile (Liga-Bezeichnung)
      flexDirection: 'row',
      //marginTop: 5,
      //marginBottom: 5,
      backgroundColor: colors.bglight,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fusszeile: {
      paddingTop: 5,
      paddingBottom: 3,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bglight,
    },
    reihe: {
      // Layout einer normalen Tabellenzeile
      flexDirection: 'row',
      marginTop: 3,
      paddingTop: 2,
      paddingBottom: 2,
      backgroundColor: colors.bglight,
      borderRadius: 10,
      borderWidth: 0.8,
      borderColor: colors.textmuted,
      borderStyle: 'solid',
      width: '100%',
    },
    reiheOben: {
      // Layout der Kopfzeile (Spaltentitel)
      flexDirection: 'row',
      //marginTop: 5,
      width: '100%',
      backgroundColor: colors.bglight,
    },
    kasten1: {
      // Spalte "Rang"
      fontSize: 12,
      //width: 30,
      textAlign: 'right',
      color: colors.text,
      fontFamily: 'roboto-bold',
      flex: 0.7,
    },
    kasten2: {
      // Spalte "Team"
      fontSize: 12,
      //width: 150,
      textAlign: 'center',
      color: colors.text,
      fontFamily: 'roboto-bold',
      flex: 3.2,
    },
    kasten3: {
      // Spalte "Punkte"
      fontSize: 12,
      width: 45,
      textAlign: 'center',
      color: colors.text,
      fontFamily: 'roboto-bold',
      flex: 0.9,
    },
    kasten4: {
      // Spalte "Tore" (Torverhältnis + Tordifferenz)
      fontSize: 12,
      width: 120,
      textAlign: 'center',
      color: colors.text,
      fontFamily: 'roboto-bold',
      flex: 2.1,
    },
    kasten5: {
      // Spalte "Spiele"
      fontSize: 12,
      //width: 45,
      textAlign: 'center',
      color: colors.text,
      fontFamily: 'roboto-bold',
      flex: 0.9,
    },
    titel: {
      // Zusätzliches Styling für die Kopfzeilen-Texte (Spaltentitel)
      color: colors.text,
      fontFamily: 'roboto-regular',
      fontSize: 12,
    },
    fusstext: {
      // Styling für den Text in der Fußzeile (Datenstand)
      color: colors.text,
      fontFamily: 'roboto-regular',
      fontSize: 10,
    },
    gruen: {
      backgroundColor: colors.gruen,
    },
    mittel: {
      // Hintergrund für gerade Zeilen
      backgroundColor: colors.bg,
    },
    scn: {
      // Hervorgehobener Hintergrund für die SC-Norddörfer-Zeile
      backgroundColor: colors.scn,
    },
  });
}
//////////////////////////////////////////////////////////////////////////////////////
