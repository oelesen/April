import { FontAwesome, Fontisto } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDays, format, subDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import call from 'react-native-phone-call';
import Knopf from '../components/knopf';
//import Colors from '../constants/Colors';
import useAbfrageApos from '../hooks/useAbfrageApos';
import { useTheme } from '../theme/ThemeContext';

const Zweite = () => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [date, setDate] = useState(new Date());
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDate(new Date());
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  /////////////////////////////////////////////////////////////////////////////////////
  let Datum = format(date, 'yyyy-MM-dd');
  //Dann wird geprüft, ob es vor oder nach 09:00 ist, denn um 9 wechselt der Notdienst
  //ist es heute vor 09:00 wird der Notdienst von gestern angezeigt
  if (new Date().getHours() < 9 && format(new Date(), 'yyyy-MM-dd') === Datum) {
    Datum = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  }
  const { data, update, isLoading, error } = useAbfrageApos(Datum);

  ////////////////////////////////////////////////////////////////////////////////////////////
  //hier finden Datumsformatierungen statt
  const anfangstag = format(new Date(Datum), 'EEEE', { locale: de });
  const anfangsdatum = format(new Date(Datum), 'dd.MM.yyyy');
  const endtag = format(addDays(new Date(Datum), 1), 'EEEE', { locale: de });
  const enddatum = format(addDays(new Date(Datum), 1), 'dd.MM.yyyy');

  /////////////////////////////////////////////////////////////////////////////////////////////
  //hier wird der Telefonknopf gestartet
  const makeCall = (number) => {
    const args = {
      number: number, // String value with the number to call
      prompt: true, // Optional boolean property. Determines if the user should be prompt prior to the call
    };
    call(args).catch(console.error);
  };
  ////////////////////////////////////////////////////////////////////////////////////////////
  //Date-Time-Picker
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

  const showTimepicker = () => {
    showMode('time');
  };

  ////////////////////////////////////////////////////////////////////////////////////////////
  //hier wird die Datumszeile generiert
  const Datumszeile = () => {
    return (
      <View style={styles.datumszeile}>
        <Text style={styles.datumszeilenText}>
          {format(date, 'EEEE', { locale: de })}, {format(date, 'dd.MM.yyyy')}
        </Text>
        <Knopf
          ziel={showDatepicker}
          beschriftung={<FontAwesome name="calendar" size={24} />}
          textfarbe={{ color: colors.bg }}
        />
      </View>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////
  // <Infos> zeigt die Informationen des Apo-Notdienstes an
  const Infos = () => {
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    } else {
      return (
        //console.log(data.Lat, data.Lon),
        <View style={styles.anzeige}>
          <Text style={styles.text}>{data.Apo}</Text>
          <Text style={styles.text1}>{data.Strasse}</Text>
          <Text style={styles.text1}>
            {data.Plz} {data.Ort}
          </Text>
          <Text style={styles.text1}>{data.Tel}</Text>
          <Text style={styles.text2}>hat Notdienst von</Text>
          <Text style={styles.text3}>
            {anfangstag}, {anfangsdatum}
          </Text>
          <Text style={styles.text3}>{data.Start} Uhr</Text>
          <Text style={styles.text3}>bis</Text>
          <Text style={styles.text3}>
            {endtag}, {enddatum}
          </Text>
          <Text style={styles.text3}>08:59 Uhr</Text>
          <View style={styles.telerahmen}>
            <Pressable onPress={() => makeCall(data.Tel)}>
              <View style={styles.tele}>
                <Fontisto name="phone" size={30} color={colors.bg} />
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                router.push({
                  pathname: '/map',
                  params: {
                    name: data.Apo,
                    strasse: data.Strasse,
                    plz: data.Plz,
                    ort: data.Ort,
                    lat: data.Lat,
                    lon: data.Lon,
                  },
                });
              }}
            >
              <View style={styles.tele}>
                <Fontisto name="map-marker-alt" size={30} color={colors.bg} />
              </View>
            </Pressable>
          </View>
        </View>
      );
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////
  return (
    <SafeAreaView style={styles.container}>
      {isInitializing ? (
        <View style={styles.anzeigencontainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <Datumszeile />
          <View style={styles.anzeigencontainer}>
            <Infos />
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              locale="de"
              value={date}
              format="DD.MM.YYYY"
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};
///////////////////////////////////////////////////////////////////////////////////////////////////
function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      //justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bg,
    },
    anzeigencontainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bg,
    },
    anzeige: {
      backgroundColor: colors.bglight, // Nutzt die hellere Hintergrundfarbe
      borderColor: colors.border, // Nutzt die Rahmenfarbe
      borderWidth: 1,
      elevation: 8,
      padding: 20,
      margin: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    telerahmen: {
      flexDirection: 'row',
    },
    tele: {
      shadowColor: colors.bordermuted,
      //shadowOpacity: 1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 15,
      borderRadius: 10,
      margin: 20,
      padding: 20,
      alignItems: 'center',
      backgroundColor: colors.primary,
      color: colors.text,
    },
    datumszeile: {
      //flex: 1,
      width: '100%',
      flexDirection: 'row',
      //marginTop: 3,
      //paddingTop: 2,
      //paddingBottom: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bg,
    },
    datumszeilenText: {
      paddingLeft: 10,
      fontSize: 18,
      color: colors.text,
    },
    text: {
      color: colors.text,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
    },
    text1: {
      fontWeight: 'bold',
      fontSize: 16,
      color: colors.textmuted,
      textAlign: 'center',
    },
    text2: {
      fontWeight: 'bold',
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
    },
    text3: {
      fontWeight: 'bold',
      fontSize: 18,
      color: colors.text,
      textAlign: 'center',
    },
    map: {
      width: '80%',
      height: '80%',
    },
  });
}
//////////////////////////////////////////////////////////////////////////////////////
export default Zweite;
