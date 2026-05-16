import {
  addHours,
  endOfDay,
  format,
  isWithinInterval,
  parse,
  startOfDay,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const CardTide = (props) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  //console.log(props);

  const [gezeiten, setGezeiten] = useState(props.Gezeiten);

  //hier werden die ortsangaben formatiert
  let ort = props.ort;
  if (ort === 'westerland') {
    ort = 'Westerland';
  }
  if (ort === 'list_hafen') {
    ort = 'List Hafen';
  }
  if (ort === 'munkmarsch') {
    ort = 'Munkmarsch';
  }
  if (ort === 'list_west') {
    ort = 'List Westseite';
  }
  if (ort === 'rantum') {
    ort = 'Rantum';
  }
  if (ort === 'hoernum_west') {
    ort = 'Hörnum Westseite';
  }
  if (ort === 'hoernum_hafen') {
    ort = 'Hörnum Hafen';
  }
  let wann = new Date(props.datum); //das angefragte Datum
  //console.log(wann);
  let datum = format(new Date(props.datum), 'dd.MM.yyyy', { locale: de });
  let wota = format(new Date(props.datum), 'eeee', { locale: de });
  //console.log(datum + ' ' + wota + ' ' + wann);

  // Dynamische Berechnung der Sommerzeit (letzter Sonntag im März bis letzter Sonntag im Oktober)
  const getDstPeriod = (date) => {
    const year = date.getFullYear();

    // Letzter Sonntag im März
    const march31 = new Date(year, 2, 31);
    let startDst = new Date(year, 2, 31);
    while (startDst.getDay() !== 0) {
      startDst.setDate(startDst.getDate() - 1);
    }
    // Zeitumstellung meist um 02:00/03:00 Uhr
    startDst.setHours(3, 0, 0);

    // Letzter Sonntag im Oktober
    const oct31 = new Date(year, 9, 31);
    let endDst = new Date(year, 9, 31);
    while (endDst.getDay() !== 0) {
      endDst.setDate(endDst.getDate() - 1);
    }
    endDst.setHours(3, 0, 0);

    return { startDst, endDst };
  };

  const { startDst, endDst } = getDstPeriod(wann);
  let periode = 'winterzeit';
  if (isWithinInterval(wann, { start: startDst, end: endDst })) {
    periode = 'sommerzeit';
  }
  //console.log(periode);

  //zeiten werden in dieser Funktion umgewandelt, je nach 'periode' (Sommer/Winterzeit)
  const zeitwandler = (tag, zeit, wasser) => {
    //console.log(tag + ' ' + zeit + ' ' + wasser);
    let stamp = parse(`${tag} ${zeit.trim()}`, 'yyyy-MM-dd H:mm', new Date());
    //let stamp = parse(tag + ' ' + zeit, 'yyyy-MM-dd HH:mm', new Date());
    //let tach = format(stamp, 'eeee', { locale: de });
    //console.log(stamp + ' ' + wasser + ' ' + tach);

    let von = startOfDay(wann);
    let bis = endOfDay(wann);

    if (periode === 'sommerzeit') {
      stamp = addHours(stamp, 1);
    }

    if (isWithinInterval(stamp, { start: von, end: bis })) {
      const formattedTime = format(stamp, 'HH:mm');

      return wasser === 'H' ? (
        <Text style={styles.textro}>{formattedTime + ' ' + wasser + 'W'}</Text>
      ) : (
        <Text style={styles.text}>{formattedTime + ' ' + wasser + 'W'}</Text>
      );
    } else {
      return null;
    }
  };

  //falls Array nur wenig Zeiten hat (Munkmarsch): rest wird "genullt"
  let eins = gezeiten[0] ? (
    zeitwandler(gezeiten[0][1], gezeiten[0][2], gezeiten[0][3])
  ) : (
    <Text style={styles.text}></Text>
  );
  let zwei = gezeiten[1] ? (
    zeitwandler(gezeiten[1][1], gezeiten[1][2], gezeiten[1][3])
  ) : (
    <Text style={styles.text}></Text>
  );
  let drei = gezeiten[2] ? (
    zeitwandler(gezeiten[2][1], gezeiten[2][2], gezeiten[2][3])
  ) : (
    <Text style={styles.text}></Text>
  );
  let vier = gezeiten[3] ? (
    zeitwandler(gezeiten[3][1], gezeiten[3][2], gezeiten[3][3])
  ) : (
    <Text style={styles.text}></Text>
  );
  let fünf = gezeiten[4] ? (
    zeitwandler(gezeiten[4][1], gezeiten[4][2], gezeiten[4][3])
  ) : (
    <Text style={styles.text}></Text>
  );
  let sechs = gezeiten[5] ? (
    zeitwandler(gezeiten[5][1], gezeiten[5][2], gezeiten[5][3])
  ) : (
    <Text style={styles.text}></Text>
  );
  let sieben = gezeiten[6] ? (
    zeitwandler(gezeiten[6][1], gezeiten[6][2], gezeiten[6][3])
  ) : (
    <Text style={styles.text}></Text>
  );
  let acht = gezeiten[7] ? (
    zeitwandler(gezeiten[7][1], gezeiten[7][2], gezeiten[7][3])
  ) : (
    <Text style={styles.text}></Text>
  );

  return (
    <View style={styles.karte}>
      <Text style={styles.text1}>Tide für {ort}</Text>
      <Text style={styles.text}>
        {wota}, den {datum}
      </Text>
      {eins}
      {zwei}
      {drei}
      {vier}
      {fünf}
      {sechs}
      {sieben}
      {acht}
    </View>
  );
};

function createStyles(colors) {
  return StyleSheet.create({
    karte: {
      width: '85%',
      paddingTop: 10,
      paddingBottom: 10,
      marginTop: 5,
      marginHorizontal: 5,
      marginBottom: 5,
      elevation: 6,
      borderRadius: 10,
      backgroundColor: colors.bglight, // Nutzt die hellere Hintergrundfarbe
      borderColor: colors.border, // Nutzt die Rahmenfarbe
      borderWidth: 1,
    },
    text1: {
      fontWeight: 'bold',
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
    },
    text: {
      fontWeight: 'bold',
      fontSize: 16,
      color: colors.textmuted,
      textAlign: 'center',
    },
    textro: {
      fontWeight: 'bold',
      fontSize: 16,
      color: colors.rot,
      textAlign: 'center',
    },
  });
}

export default CardTide;
