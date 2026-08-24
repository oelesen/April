import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { format, parse } from 'date-fns';
import { de } from 'date-fns/locale';
import { useTheme } from '../theme/ThemeContext';

const CardFaehre = (props) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [zeit, setZeit] = useState();
  const [plan] = useState(props.Plan);

  ///////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    let timer = setInterval(() => {
      setZeit(format(new Date(), 'dd.MM.yyyy HH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  }, [zeit]);
  ////////////////////////////////////////////////////////////////////////////////////
  let von = props.von;
  let wann = props.wann;
  const heute = new Date();

  const Datum = format(heute, 'dd.MM.yyyy');
  const Wochentag = format(heute, 'EEEE', { locale: de });
  //zeit (aktualisiert jede Sekunde via setInterval) wird geparst, um Stunde/Minute/Sekunde daraus zu ziehen
  const zeitDate = zeit
    ? parse(zeit, 'dd.MM.yyyy HH:mm:ss', new Date())
    : heute;
  const Stunde = format(zeitDate, 'HH');
  const Minute = format(zeitDate, 'mm');
  const Sekunde = format(zeitDate, 'ss');
  let Uhrzeit = Stunde + ':' + Minute;
  const tsDate = parse(wann, 'dd.MM.yyyy', new Date());
  const wt = format(tsDate, 'EEEE', { locale: de });

  const Text1 = () => {
    if (wann !== Datum) {
      return (
        <Text style={styles.text}>
          {wt}, den {wann}
        </Text>
      );
    } else {
      return (
        <Text style={styles.text}>
          {Wochentag}, den {Datum}
        </Text>
      );
    }
  };
  const Text2 = () => {
    if (wann !== Datum) {
      return <Text style={styles.text}></Text>;
    } else {
      return (
        <Text style={styles.text}>
          {Stunde} Uhr {Minute} : {Sekunde}
        </Text>
      );
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Nur wenn das gewählte Datum "heute" ist, werden bereits vergangene Abfahrten herausgefiltert.
  //Bei einem anderen Tag wird der komplette Fahrplan angezeigt.
  const list = wann === Datum ? plan.filter((item) => item > Uhrzeit) : plan;
  //console.log(list);
  if (wann === Datum && list.length < 1) {
    return (
      <View style={styles.karte}>
        <Text style={styles.text}>ab {von}</Text>
        <Text1 />
        <Text2 />
        <ScrollView
          style={styles.lauf}
          contentContainerStyle={styles.laufContent}
        >
          <View>
            <Text style={styles.text}></Text>
            <Text style={styles.text1}>Heute fährt</Text>
            <Text style={styles.text1}>ab {von}</Text>
            <Text style={styles.text1}>keine Fähre mehr!</Text>
          </View>
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View style={styles.karte}>
        <Text style={styles.text}>ab {von}</Text>
        <Text1 />
        <Text2 />
        <ScrollView
          style={styles.lauf}
          contentContainerStyle={styles.laufContent}
        >
          <View>
            {list.map((item, key) => (
              <Text key={key} style={styles.text1}>
                {item}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
};

export default CardFaehre;

function createStyles(colors) {
  return StyleSheet.create({
    karte: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
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
    text: {
      paddingHorizontal: 30,
      fontFamily: 'roboto-bold',
      fontSize: 20,
      color: colors.text,
      textAlign: 'center',
    },
    text1: {
      paddingHorizontal: 50,
      fontFamily: 'roboto-bold',
      fontSize: 20,
      color: colors.rot,
      textAlign: 'center',
    },
    text2: {
      paddingHorizontal: 50,
      fontFamily: 'roboto-bold',
      fontSize: 20,
      color: colors.text,
      textAlign: 'center',
    },
    lauf: {
      flex: 1,
      width: '100%',
    },
    laufContent: {
      alignItems: 'center',
      paddingBottom: 5,
    },
  });
}
