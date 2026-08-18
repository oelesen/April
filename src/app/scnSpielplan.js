import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useState } from 'react';
import useAbfrageSpielplan from '../hooks/useAbfrageSpielplan';
import { format, isAfter } from 'date-fns';
import Truppe from '../components/scn_namen';
import Knopf from '../components/knopf';

// Shared timestamp parser: converts first space to 'T', validates Date, returns safe invalid result on failure
const parseTimestamp = (timestamp) => {
  if (!timestamp) return new Date(NaN);
  try {
    const converted = timestamp.replace(' ', 'T');
    const date = new Date(converted);
    if (isNaN(date.getTime())) return new Date(NaN);
    return date;
  } catch (e) {
    return new Date(NaN);
  }
};

const ScnSpielplan = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { alte, neue, update, isLoading, error } = useAbfrageSpielplan();
  const [auswahl, setAuswahl] = useState('zukunft'); //der Auswahlbutton
  //let wann = update; aus spielplan.json
  let wann = update ? format(parseTimestamp(update), 'dd.MM.yyyy HH:mm') : ''; //aus spiele.json
  //const heute = format(new Date(), 'dd.MM.yyyy');
  //console.log(data.spiele);
  console.log(alte);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Lade Spielplan…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Fehler beim Laden des Spielplans.</Text>
      </View>
    );
  }
  ////////////////////////////////////////////////////////////////////////////////////
  //hier wird das Ergebnis formatiert und geschrieben
  //bekommt in Renderliste die Pops erge und sz
  const Ergebnis = (props) => {
    const heute = new Date();
    const erge = props.result;
    const spielzeit = parseTimestamp(props.sz);
    //console.log(moment(props.sz));

    if (isAfter(spielzeit, heute)) {
      return <Text>- : -</Text>;
    } else {
      return <Text>{erge}</Text>;
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////
  //auswahl der Datensätze, die angezeigt werden
  let daten = auswahl === 'vergangen' ? alte : neue;
  console.log(daten);
  ////////////////////////////////////////////////////////////////////////////////////
  //wenn auf die Knöpfe gedrückt wird, wird state von auswahl geändert
  const vergangen = () => {
    setAuswahl('vergangen'); // neue Spiele
  };
  const zukunft = () => {
    setAuswahl('zukunft'); // alte Spiele
  };
  ////////////////////////////////////////////////////////////////////////////////////
  //die Backgroundfarbe des Auswahlknopfes vergangene/zukünftige (in Abhängigkeit vom State)

  let farv1 = auswahl === 'zukunft' ? { backgroundColor: colors.rot } : null;
  let farv2 = auswahl === 'vergangen' ? { backgroundColor: colors.rot } : null; //{ backgroundColor: colors.bordermuted };

  /////////////////////////////////////////////////////////////////////////////////////
  //hier werden die einzelnen Begegnungen gerendert, farbig abgestimmt
  const Renderliste = ({ item }) => {
    //zuerst die vergangenen Spiele: grün=gewonnen, rot= verloren, hellblau=unentschieden
    if (auswahl === 'vergangen') {
      return (
        <View
          style={{
            ...styles.spieltag,
            ...styles[GetResultColor({ lo: item.erg, heim: item.heim })],
          }}
        >
          <View style={styles.datumZeile}>
            <Text style={styles.datumsText}>
              <Umgewandelt da={item.timestamp} />
            </Text>
          </View>
          <View style={styles.spieleZeile}>
            <Text style={styles.links}>
              <Truppe name={item.heim} />
            </Text>
            <Text style={styles.mitte}>
              <Ergebnis
                //style={styles.mitte}
                result={item.erg}
                sz={item.timestamp}
              />
            </Text>
            <Text style={styles.rechts}>
              <Truppe name={item.ausw} />
            </Text>
          </View>
        </View>
      );
    }
    //danach die zukünftigen: Auswärtsspiele in hellblau
    if (item.heim !== 'SC Norddörfer') {
      return (
        <View style={styles.spieltag}>
          <View style={styles.datumZeile}>
            <Text style={styles.datumsText}>
              <Umgewandelt da={item.timestamp} />
            </Text>
          </View>
          <View style={styles.spieleZeile}>
            <Text style={styles.links}>
              <Truppe name={item.heim} />
            </Text>
            <Text style={styles.mitte}>
              <Ergebnis
                style={styles.mitte}
                result={item.erg}
                sz={item.timestamp}
              />
            </Text>
            <Text style={styles.rechts}>
              <Truppe name={item.ausw} />
            </Text>
          </View>
        </View>
      );
    }
    //danach die zukünftigen: Heimspiele in gelb
    if (item.heim === 'SC Norddörfer') {
      return (
        <View style={{ ...styles.spieltag, ...styles.scn }}>
          <View style={styles.datumZeile}>
            <Text style={styles.datumsText}>
              <Umgewandelt da={item.timestamp} />
            </Text>
          </View>
          <View style={styles.spieleZeile}>
            <Text style={styles.links}>
              <Truppe name={item.heim} />
            </Text>
            <Text style={styles.mitte}>
              <Ergebnis
                style={styles.mitte}
                result={item.erg}
                sz={item.timestamp}
              />
            </Text>
            <Text style={styles.rechts}>
              <Truppe name={item.ausw} />
            </Text>
          </View>
        </View>
      );
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////
  //hier werden die Spiele dargestellt
  return (
    <View style={styles.container}>
      <View style={styles.buttoncard}>
        <Knopf
          ziel={vergangen}
          beschriftung={'vergangene'}
          farbe={farv2}
          textfarbe={farv2 ? { color: colors.weiss } : { color: colors.bg }}
        />
        <Knopf
          ziel={zukunft}
          beschriftung={'zukünftige'}
          farbe={farv1}
          textfarbe={farv1 ? { color: colors.weiss } : { color: colors.bg }}
        />
      </View>
      <View style={styles.tabelle}>
        {/* <Head /> */}
        <FlatList
          data={daten.spiele}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Renderliste item={item} />}
        />
        <View style={styles.fusszeile}>
          <Text style={styles.text}>Daten Stand: {wann}</Text>
        </View>
      </View>
    </View>
  );
};

export default ScnSpielplan;

/////////////////////////////////////////////////////////////////////////////////////
//Hier wird "Termin" richtig formatiert
const Umgewandelt = (props) => {
  const date = new Date(props.da).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  //console.log(date);
  return <>{date}</>;
};

///////////////////////////////////////////////////////////////////////////////////
//GetResultColor wird im JSX aufgerufen und bekommt das Ergebnis. Hier wird ermittelt,
//ob gewonnen, verloren oder unentschieden: Ergebnis wird beim Rendern verwendet für die Farbe
const GetResultColor = (props) => {
  const [home, away] = props.lo.split(':').map(Number);

  if (home > away && props.heim === 'SC Norddörfer') {
    return 'win'; // gewonnen
  } else if (home < away && props.heim === 'SC Norddörfer') {
    return 'lose'; // verloren
  } else if (home === away && props.heim === 'SC Norddörfer') {
    return 'draw'; // unentschieden
  } else if (home < away && props.heim !== 'SC Norddörfer') {
    return 'win'; // unentschieden
  } else if (home > away && props.heim !== 'SC Norddörfer') {
    return 'lose'; // unentschieden
  } else if (home === away && props.heim !== 'SC Norddörfer') {
    return 'draw'; // unentschieden
  }
};

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bg,
    },
    spieltag: {
      backgroundColor: colors.bglight,
      marginTop: 5,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.border,
      borderRadius: 10,
      shadowColor: colors.bgdark,
      shadowOpacity: 0.26,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 5,
    },
    scn: {
      backgroundColor: colors.scn,
      color: colors.text,
    },
    win: {
      backgroundColor: colors.gruen,
    },
    lose: {
      backgroundColor: colors.rose,
    },
    draw: {
      backgroundColor: colors.bglight,
    },
    tabelle: {
      flex: 1,
      width: '95%',
      //flexDirection: 'row',
      //justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: Colors.beige,
    },
    fusszeile: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    datumZeile: {
      width: '100%',
      //fontSize: 24,
      //paddingHorizontal: 10,
      textAlign: 'center',
      //color: colors.dubl,
      borderBottomWidth: 0.8,
      borderStyle: 'solid',
      borderColor: colors.border,
    },
    datumsText: {
      //fontWeight: 'bold',
      fontSize: 16,
      //backgroundColor: Colors.hell,
      textAlign: 'center',
      color: colors.text,
    },
    spieleZeile: {
      //flex: 4,
      //width: '20%',
      flexDirection: 'row',
      marginTop: 3,
      //paddingTop: 2,
      //paddingBottom: 2,
      //justifyContent: 'space-evenly',
      //backgroundColor: Colors.hell,
      justifyContent: 'center',
      alignItems: 'center',
    },
    links: {
      fontSize: 14,
      width: '44%',
      textAlign: 'center',
      //fontWeight: 'bold',
      color: colors.text,
    },
    mitte: {
      fontSize: 14,
      width: '12%',
      textAlign: 'center',
      //fontWeight: 'bold',
      color: colors.text,
    },
    rechts: {
      fontSize: 14,
      width: '44%',
      textAlign: 'center',
      //fontWeight: 'bold',
      color: colors.text,
    },
    text: {
      color: colors.text,
      fontSize: 14,
    },
    buttoncard: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 1,
      paddingHorizontal: 5,
      backgroundColor: colors.bgdark,
      borderWidth: 1,
      borderColor: colors.bglight,
      borderStyle: 'solid',
    },
  });
}
