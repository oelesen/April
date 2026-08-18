import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../theme/ThemeContext';
import axios from 'axios';
import { format } from 'date-fns';

const TankstellenModal = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const params = useLocalSearchParams();
  const { nummer } = params;
  console.log(nummer);

  const [loading, setLoading] = useState(true);
  const [daten, setDaten] = useState(undefined);
  //const [nummer, setNummer] = useState(nummer);
  const [wann, setWann] = useState(undefined);

  //hier wird das Array mit den Tankstellen-Details aus dem Web geholt
  useEffect(() => {
    axios
      .get(`https://www.rundf.eu/php/tankstellendetails.php?nr=` + nummer)
      .then((response) => {
        let array = response.data;
        console.log(array);
        //array[0] ist der Timestamp aus der Datenbank
        let zeit = array[0];
        //console.log(zeit);
        setWann(zeit);
        //array[1] ist das Objekt aus der Datenbank
        let feldclear = array[1];
        feldclear = JSON.parse(feldclear);
        //console.log(feldclear);
        //console.log(feldclear.prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].diesel);
        //console.log('Dieselpreis: ' + tank[0].prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].diesel);
        setDaten(feldclear);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [nummer]);
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  } else
    return (
      <View style={styles.container}>
        <View style={styles.karte}>
          <Text style={styles.text}>Marke: {daten.station.brand}</Text>
          <Text style={styles.text}>
            Straße: {daten.station.street} {daten.station.houseNumber}
          </Text>
          <Text style={styles.text}>
            Ort: {daten.station.postCode} {daten.station.place}
          </Text>
          <Text style={styles.text}>
            Lat: {daten.station.lat}, Long: {daten.station.lng}
          </Text>
          <Text style={styles.text}>Öffnungszeiten:</Text>
          {daten.station.openingTimes.map((item, key) => (
            <Text key={key} style={styles.text}>
              {item.text}: {'\n'}von {item.start} bis {item.end}
            </Text>
          ))}
          <Text>{daten.station.openingTimes.overrides}</Text>
          <Text style={styles.text}>
            {/* (last update: {moment(wann).format('DD.MM.YYYY HH:mm')}) */}
            last update: {format(new Date(wann), 'HH:mm')}
          </Text>
        </View>
      </View>
    );
};

//////////////////////////////////////////////////////////////////////////////////////////////////
function createStyles(colors) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: colors.bg,
      justifyContent: 'center',
      paddingTop: 150,
      paddingBottom: 150,
    },
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
    text: {
      paddingHorizontal: 10,
      fontFamily: 'roboto-bold',
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
    },
  });
}
/////////////////////////////////////////////////////////////////////////////
export default TankstellenModal;
