import {
  StyleSheet,
  View,
  Platform,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { format, addDays, isSameDay } from 'date-fns';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import CardFaehre from '../components/cardFaehre';
import Knopf from '../components/knopf';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Faehre = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = createStyles(colors, insets);

  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [abfahrt, setAbfahrt] = useState('List');

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //hier wird das Array mit den Fahrplänen aus dem Web geholt
  useEffect(() => {
    let wann = format(new Date(date), 'yyyy-MM-dd');
    //console.log(wann);
    axios
      .get(
        //`http://192.168.178.102/SyltApp/php/faehre.php?date=${wann}&von=${abfahrt}`
        `https://www.rundf.eu/php/faehre.php?date=${wann}&von=${abfahrt}`,
      )
      .then((response) => {
        let array = response.data;
        //console.log(array);
        let feldclear = array;
        setPlan(feldclear);
        //console.log(feldclear);
        setLoading(false);
      })
      .catch(function (error) {
        //console.log(error);
      });
  }, [date, abfahrt]);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //datepicker
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    //setDate(new Date());
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //falls ausgewähltes Datum ungleich heute: gewähltes Datum wird als "date" gesetzt.
  //falls "date" ungleich heute: "date" wird auf heute gesetzt
  const dateMorgen = () => {
    if (isSameDay(new Date(), date)) {
      setDate(addDays(new Date(), 1));
    } else {
      setDate(new Date());
    }
  };
  //zeigt auf Button an: "morgen" oder "heute"
  let tageswechsler = isSameDay(new Date(), date) ? 'morgen' : 'heute';

  let zuch = require('../assets/images/Bilder/faehre2.jpg');
  let wann = format(new Date(date), 'dd.MM.yyyy');

  /////////////////////////////////////////////////////////////////////////////////////////////////
  //in Zeichen erfolgt die eigentliche Ausgabe: Baustein "CardFaehre"
  //wird mit den notwendigen Infos gefüttert
  const Zeichen = () => {
    if (loading === 'true') {
      return (
        <View>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    } else {
      return <CardFaehre Plan={plan} wann={wann} von={abfahrt} />;
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////
  //in "button" (Komponente Knopf) wird der Abfahrtsort gewählt
  //und hier wirde der State geschaltet
  const abfahrerL = () => {
    setAbfahrt('List');
  };
  const abfahrerH = () => {
    setAbfahrt('Havneby');
  };
  let farv1 = abfahrt === 'List' ? { backgroundColor: colors.rot } : null;
  let farv2 = abfahrt === 'Havneby' ? { backgroundColor: colors.rot } : null;
  /////////////////////////////////////////////////////////////////////////
  return (
    <View style={styles.container}>
      <ImageBackground source={zuch} style={styles.bildcontainer}>
        <View style={styles.buttoncard}>
          <Knopf
            ziel={abfahrerL}
            beschriftung={'ab List'}
            farbe={farv1}
            textfarbe={farv1 ? { color: colors.weiss } : { color: colors.bg }}
          />
          <Knopf
            ziel={abfahrerH}
            beschriftung={'ab Havneby'}
            farbe={farv2}
            textfarbe={farv2 ? { color: colors.weiss } : { color: colors.bg }}
          />
        </View>
        <Zeichen />
        <View style={styles.footButtoncard}>
          <Knopf
            ziel={dateMorgen}
            beschriftung={tageswechsler}
            textfarbe={{ color: colors.bg }}
          />
          <Knopf
            ziel={showDatepicker}
            beschriftung={<FontAwesome name="calendar" size={24} />}
            textfarbe={{ color: colors.bg }}
          />
        </View>
      </ImageBackground>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default Faehre;
/////////////////////////////////////////////////////////////////////////////
function createStyles(colors, insets) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    bildcontainer: {
      flex: 1,
      resizeMode: 'contain',
      width: '100%',
      alignItems: 'center',
    },
    buttoncard: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '85%',
      paddingTop: 5,
      paddingBottom: 5,
      marginTop: 5,
      marginHorizontal: 5,
      marginBottom: 5,
      elevation: 6,
      borderRadius: 10,
      backgroundColor: colors.bglight, // Nutzt die hellere Hintergrundfarbe
      borderColor: colors.border, // Nutzt die Rahmenfarbe
      borderWidth: 1,
    },
    footButtoncard: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '85%',
      paddingTop: 5,
      paddingBottom: 5,
      marginTop: 5,
      marginHorizontal: 5,
      marginBottom: insets.bottom + 5,
      elevation: 6,
      borderRadius: 10,
      backgroundColor: colors.bglight, // Nutzt die hellere Hintergrundfarbe
      borderColor: colors.border, // Nutzt die Rahmenfarbe
      borderWidth: 1,
    },
  });
}
