import { useEffect, useState } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';
import { addDays, format } from 'date-fns';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import CardTide from '../components/cardTide';
import Knopf from '../components/knopf';
//import Colors from '../constants/Colors';

import { useTheme } from '../theme/ThemeContext';

const Tide = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [wahltag, setWahltag] = useState(undefined);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [ort, setOrt] = useState('westerland');
  const [gezeiten, setGezeiten] = useState([]); //die geladene Gezeitentabelle
  const [pickedData, setPickedData] = useState();
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  //hier wird das Array mit den Gezeiten aus dem Web geholt
  useEffect(() => {
    const controller = new AbortController();
    let wann = format(date, 'yyyy-MM-dd');

    axios
      .get(
        //`http://19:168.178.102/SyltApp/php/tide.php?date=${wann}&ort=${ort}`
        `https://www.rundf.eu/php/tide.php?date=${wann}&ort=${ort}`,
        { signal: controller.signal },
      )
      .then((response) => {
        let array = response.data;
        //console.log(array);
        //let feldclear = MailClear(array);
        let feldclear = array;
        //console.log(feldclear);
        setGezeiten(feldclear);
        //console.log(feldclear);
        setLoading(false);
      })
      .catch(function (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.log(error);
        }
      });

    return () => {
      controller.abort();
    };
  }, [date, ort]);
  //********************************************für den Datepicker
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    //console.log(currentDate + 'hallo');
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

  const showTimepicker = () => {
    showMode('time');
  };
  //******************************************** Ende  Datepicker + Anfang Picker
  let ortschaften = [
    {
      label: 'List Westseite',
      value: 1,
    },
    {
      label: 'List Hafen',
      value: 2,
    },
    {
      label: 'Munkmarsch',
      value: 3,
    },
    {
      label: 'Westerland',
      value: 4,
    },
    {
      label: 'Rantum Hafen',
      value: 5,
    },
    {
      label: 'Hörnum Westseite',
      value: 6,
    },
    {
      label: 'Hörnum Hafen',
      value: 7,
    },
  ];
  //******************************************** Ende Picker
  //falls ausgewähltes Datum ungleich heute: gewähltes Datum wird als "date"gesetzt.
  //falls "date" ungleich heute: "date" wird auf heute gesetzt
  const dateMorgen = () => {
    if (format(new Date(), 'dd.MM.yyyy') === format(date, 'dd.MM.yyyy')) {
      let morgen = addDays(new Date(), 1);
      setDate(morgen);
    } else {
      setDate(new Date());
    }
  };
  //zeigt auf Button an: "morgen" oder "heute"
  let tageswechsler =
    format(new Date(), 'dd.MM.yyyy') !== format(date, 'dd.MM.yyyy')
      ? 'heute'
      : 'morgen';
  //let wann = moment(date).format('DD.MM.YYYY');
  ////////////////////////////////////////////////////////////////////////
  //in Infos wird der Inhalt von cardTide gesteuert: solange die Daten noch geladen werden, wird ein Ladeindikator angezeigt.
  const Infos = () => {
    if (loading) {
      return (
        <View>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      );
    } else {
      return <CardTide Gezeiten={gezeiten} datum={date} ort={ort} />;
    }
  };
  //////////////////////////////////////////////////////////////////////////
  //Auswahl des Hintergrundbildes, je nachdem ob Dark oder Light Mode
  const bild = isDark
    ? require('../assets/images/Bilder/leer.png')
    : require('../assets/images/Bilder/leer.png'); // Standardbild;
  ////////////////////////////////////////////// Farben der Buttons, je nachdem welcher Ort gewählt ist
  let farv1 = ort === 'list_west' ? { backgroundColor: colors.rot } : null;
  let farv2 = ort === 'list_hafen' ? { backgroundColor: colors.rot } : null;
  let farv3 = ort === 'westerland' ? { backgroundColor: colors.rot } : null;
  let farv4 = ort === 'munkmarsch' ? { backgroundColor: colors.rot } : null;
  let farv5 = ort === 'rantum' ? { backgroundColor: colors.rot } : null;
  let farv6 = ort === 'hoernum_west' ? { backgroundColor: colors.rot } : null;
  let farv7 = ort === 'hoernum_hafen' ? { backgroundColor: colors.rot } : null;
  //////////////////////////////////////////////////////////////////////////////////////////
  //in "button" (Komponente Knopf) wird der Abfahrtsort gewählt
  //und hier wirde der State geschaltet
  const listhafen = () => {
    setOrt('list_hafen');
  };
  const listwest = () => {
    setOrt('list_west');
  };
  const munkmarsch = () => {
    setOrt('munkmarsch');
  };
  const westerland = () => {
    setOrt('westerland');
  };
  const rantum = () => {
    setOrt('rantum');
  };
  const hoernumwest = () => {
    setOrt('hoernum_west');
  };
  const hoernumhafen = () => {
    setOrt('hoernum_hafen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={bild} style={styles.bildcontainer}>
        <View style={styles.buttoncard}>
          <Knopf
            ziel={listwest}
            beschriftung={'List Westseite'}
            farbe={farv1}
            textfarbe={farv1 ? { color: colors.weiss } : { color: colors.bg }}
          />
          <Knopf
            ziel={listhafen}
            beschriftung={'List Hafen'}
            farbe={farv2}
            textfarbe={farv2 ? { color: colors.weiss } : { color: colors.bg }}
          />
        </View>
        <View style={styles.buttoncard}>
          <Knopf
            ziel={westerland}
            beschriftung={'Westerland'}
            farbe={farv3}
            textfarbe={farv3 ? { color: colors.weiss } : { color: colors.bg }}
          />
          <Knopf
            ziel={munkmarsch}
            beschriftung={'Munkmarsch'}
            farbe={farv4}
            textfarbe={farv4 ? { color: colors.weiss } : { color: colors.bg }}
          />
        </View>
        <View style={styles.buttoncard}>
          <Knopf
            ziel={rantum}
            beschriftung={'Rantum Hafen'}
            farbe={farv5}
            textfarbe={farv5 ? { color: colors.weiss } : { color: colors.bg }}
          />
        </View>
        <View style={styles.buttoncard}>
          <Knopf
            ziel={hoernumwest}
            beschriftung={'Hörnum Westseite'}
            farbe={farv6}
            textfarbe={farv6 ? { color: colors.weiss } : { color: colors.bg }}
          />
          <Knopf
            ziel={hoernumhafen}
            beschriftung={'Hörnum Hafen'}
            farbe={farv7}
            textfarbe={farv7 ? { color: colors.weiss } : { color: colors.bg }}
          />
        </View>
        <Infos />
        <View style={styles.buttoncard}>
          <Knopf
            ziel={dateMorgen}
            beschriftung={tageswechsler}
            textfarbe={{ color: colors.bg }}
          />
          <Knopf
            ziel={showDatepicker}
            beschriftung={<FontAwesome name="calendar" size={18} />}
            textfarbe={{ color: colors.bg }}
          />
        </View>
      </ImageBackground>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          locale="de"
          value={date}
          format="DD.MM.YYYY"
          mode="date"
          is24Hour={true}
          display="default"
          maximumDate={new Date(2026, 12, 31)}
          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
};

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgDark, // Nutzt die Hintergrundfarbe aus dem Theme
    },
    bildcontainer: {
      flex: 1,
      resizeMode: 'contain',
      //height: '93%',
      width: '100%',
      alignItems: 'center',
      //backgroundColor: Colors.be4,
    },
    buttoncard: {
      flexDirection: 'row',
      justifyContent: 'space-around',
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
    pickerStyle: {
      backgroundColor: colors.bg, // Nutzt die Hintergrundfarbe aus dem Theme
      borderWidth: 1,
      borderColor: colors.border, // Nutzt die Randfarbe aus dem Theme
      borderRadius: 5,
      alignItems: 'center',
      paddingHorizontal: 3,
      paddingVertical: 3,
      marginHorizontal: 3,
      marginVertical: 3,
      height: 50,
      width: 300,
    },
    pickertext: {
      color: colors.text, // Nutzt die Textfarbe aus dem Theme
      textAlign: 'center',
      fontFamily: 'open-sans-bold',
      fontSize: 16,
    },
  });
}

export default Tide;
