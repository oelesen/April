import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useRouter } from 'expo-router';
import axios from 'axios';
import CardTanken from '../components/cardTanken';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tanken = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [daten, setDaten] = useState(undefined);
  const [wann, setWann] = useState(undefined);
  //const [modalVisible, setModalVisible] = useState(false);
  //const [modalWahl, setModalWahl] = useState(undefined);
  /////////////////////////////////////////////////////////////////////////////////////
  //hier wird das Array mit den Tankstellendaten aus dem Web geholt
  useEffect(() => {
    axios
      .get(`https://www.rundf.eu/php/tanken.php`)
      .then((response) => {
        let array = response.data;
        //console.log(array);
        //array[0] ist der Timestamp aus der Datenbank
        let zeit = array[0];
        //console.log(zeit);
        setWann(zeit);
        //array[1] ist das Objekt aus der Datenbank
        let feldclear = array[1];
        feldclear = JSON.parse(feldclear);
        //console.log(feldclear.prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].diesel);
        //console.log('Dieselpreis: ' + tank[0].prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].diesel);
        setDaten(feldclear);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  //console.log(daten);
  /*
            open={daten.prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].open}
            diesel={daten.prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].diesel}
            normale10={daten.prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].e10}
            supere5={daten.prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].e5}

c113f1f5-2a00-4a8c-a9c3-9d3beb69c99f Aral Tinnum
41bd2134-96d2-479f-8c3f-eb6f98a769eb Sell Westerland
005056ba-7cb6-1ed2-bceb-76ac288c4d25 Star List
3da08d1f-96a0-420c-bf64-eda2b7af12df Elan Niebüll
578ef404-6085-47e6-82f6-27a1fd8c89d8 Tankpoint Niebüll
2c6664d4-7048-4e8e-9f03-128d73da39ca Aral Risum-Lindholm
005056ba-7cb6-1ed2-bceb-8f2aa1df2d35 Star Stedesand
471d173e-4615-461f-b6f6-0e0a6c260e0b BFT Stadum
7abe5a10-1d6e-408a-af77-f8553e2c68e2 Shell Handewitt
*/
  ////////////////////////////////////////////////////////////////////////////////////////////////
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  } else
    return (
      <View style={styles.container}>
        <View style={styles.buttoncard}>
          <Text style={styles.text}>
            {/*last update: {moment(wann).format('HH:mm')}*/}
            last update: {format(new Date(wann), 'HH:mm')}
          </Text>
        </View>
        <ScrollView style={styles.full}>
          <View style={styles.tabelle}>
            <Pressable
              style={styles.karte}
              onPress={() => {
                router.push({
                  pathname: '/tankstellenModal',
                  params: {
                    nummer: 'c113f1f5-2a00-4a8c-a9c3-9d3beb69c99f',
                  },
                });
              }}
            >
              <CardTanken
                name={'Aral'}
                ort={'Tinnum'}
                diesel={
                  daten.prices['c113f1f5-2a00-4a8c-a9c3-9d3beb69c99f'].diesel
                }
                normale10={
                  daten.prices['c113f1f5-2a00-4a8c-a9c3-9d3beb69c99f'].e10
                }
                supere5={
                  daten.prices['c113f1f5-2a00-4a8c-a9c3-9d3beb69c99f'].e5
                }
                open={
                  daten.prices['c113f1f5-2a00-4a8c-a9c3-9d3beb69c99f'].status
                }
              />
            </Pressable>
            <Pressable
              style={styles.karte}
              onPress={() => {
                router.push({
                  pathname: '/tankstellenModal',
                  params: {
                    nummer: '41bd2134-96d2-479f-8c3f-eb6f98a769eb',
                  },
                });
              }}
            >
              <CardTanken
                name={'Shell'}
                ort={"W'land"}
                diesel={
                  daten.prices['41bd2134-96d2-479f-8c3f-eb6f98a769eb'].diesel
                }
                normale10={
                  daten.prices['41bd2134-96d2-479f-8c3f-eb6f98a769eb'].e10
                }
                supere5={
                  daten.prices['41bd2134-96d2-479f-8c3f-eb6f98a769eb'].e5
                }
                open={
                  daten.prices['41bd2134-96d2-479f-8c3f-eb6f98a769eb'].status
                }
              />
            </Pressable>
            <Pressable
              style={styles.karte}
              onPress={() => {
                router.push({
                  pathname: '/tankstellenModal',
                  params: {
                    nummer: '005056ba-7cb6-1ed2-bceb-76ac288c4d25',
                  },
                });
              }}
            >
              <CardTanken
                name={'Star'}
                ort={'List'}
                diesel={
                  daten.prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].diesel
                }
                normale10={
                  daten.prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].e10
                }
                supere5={
                  daten.prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].e5
                }
                open={
                  daten.prices['005056ba-7cb6-1ed2-bceb-76ac288c4d25'].status
                }
              />
            </Pressable>
          </View>
          <View style={styles.tabelle}>
            <Pressable
              style={styles.karte}
              onPress={() => {
                router.push({
                  pathname: '/tankstellenModal',
                  params: {
                    nummer: '3da08d1f-96a0-420c-bf64-eda2b7af12df',
                  },
                });
              }}
            >
              <CardTanken
                name={'Elan'}
                ort={'Niebüll'}
                diesel={
                  daten.prices['3da08d1f-96a0-420c-bf64-eda2b7af12df'].diesel
                }
                normale10={
                  daten.prices['3da08d1f-96a0-420c-bf64-eda2b7af12df'].e10
                }
                supere5={
                  daten.prices['3da08d1f-96a0-420c-bf64-eda2b7af12df'].e5
                }
                open={
                  daten.prices['3da08d1f-96a0-420c-bf64-eda2b7af12df'].status
                }
              />
            </Pressable>
            <Pressable
              style={styles.karte}
              onPress={() => {
                router.push({
                  pathname: '/tankstellenModal',
                  params: {
                    nummer: '578ef404-6085-47e6-82f6-27a1fd8c89d8',
                  },
                });
              }}
            >
              <CardTanken
                name={'Unitol'}
                ort={'Niebüll'}
                diesel={
                  daten.prices['578ef404-6085-47e6-82f6-27a1fd8c89d8'].diesel
                }
                normale10={
                  daten.prices['578ef404-6085-47e6-82f6-27a1fd8c89d8'].e10
                }
                supere5={
                  daten.prices['578ef404-6085-47e6-82f6-27a1fd8c89d8'].e5
                }
                open={
                  daten.prices['578ef404-6085-47e6-82f6-27a1fd8c89d8'].status
                }
              />
            </Pressable>
            <Pressable
              style={styles.karte}
              onPress={() => {
                router.push({
                  pathname: '/tankstellenModal',
                  params: {
                    nummer: '2c6664d4-7048-4e8e-9f03-128d73da39ca',
                  },
                });
              }}
            >
              <CardTanken
                name={'Aral'}
                ort={'Risum'}
                diesel={
                  daten.prices['2c6664d4-7048-4e8e-9f03-128d73da39ca'].diesel
                }
                normale10={
                  daten.prices['2c6664d4-7048-4e8e-9f03-128d73da39ca'].e10
                }
                supere5={
                  daten.prices['2c6664d4-7048-4e8e-9f03-128d73da39ca'].e5
                }
                open={
                  daten.prices['2c6664d4-7048-4e8e-9f03-128d73da39ca'].status
                }
              />
            </Pressable>
          </View>
          <View style={styles.tabelle}>
            <Pressable
              style={styles.karte}
              onPress={() => {
                router.push({
                  pathname: '/tankstellenModal',
                  params: {
                    nummer: '005056ba-7cb6-1ed2-bceb-8f2aa1df2d35',
                  },
                });
              }}
            >
              <CardTanken
                name={'Star'}
                ort={'Stedesand'}
                diesel={
                  daten.prices['005056ba-7cb6-1ed2-bceb-8f2aa1df2d35'].diesel
                }
                normale10={
                  daten.prices['005056ba-7cb6-1ed2-bceb-8f2aa1df2d35'].e10
                }
                supere5={
                  daten.prices['005056ba-7cb6-1ed2-bceb-8f2aa1df2d35'].e5
                }
                open={
                  daten.prices['005056ba-7cb6-1ed2-bceb-8f2aa1df2d35'].status
                }
              />
            </Pressable>
            <Pressable
              style={styles.karte}
              onPress={() => {
                router.push({
                  pathname: '/tankstellenModal',
                  params: {
                    nummer: '471d173e-4615-461f-b6f6-0e0a6c260e0b',
                  },
                });
              }}
            >
              <CardTanken
                name={'BfT'}
                ort={'Stadum'}
                diesel={
                  daten.prices['471d173e-4615-461f-b6f6-0e0a6c260e0b'].diesel
                }
                normale10={
                  daten.prices['471d173e-4615-461f-b6f6-0e0a6c260e0b'].e10
                }
                supere5={
                  daten.prices['471d173e-4615-461f-b6f6-0e0a6c260e0b'].e5
                }
                open={
                  daten.prices['471d173e-4615-461f-b6f6-0e0a6c260e0b'].status
                }
              />
            </Pressable>
            <Pressable
              style={styles.karte}
              onPress={() => {
                router.push({
                  pathname: '/tankstellenModal',
                  params: {
                    nummer: '7abe5a10-1d6e-408a-af77-f8553e2c68e2',
                  },
                });
              }}
            >
              <CardTanken
                name={'Shell'}
                ort={'Handewitt'}
                diesel={
                  daten.prices['7abe5a10-1d6e-408a-af77-f8553e2c68e2'].diesel
                }
                normale10={
                  daten.prices['7abe5a10-1d6e-408a-af77-f8553e2c68e2'].e10
                }
                supere5={
                  daten.prices['7abe5a10-1d6e-408a-af77-f8553e2c68e2'].e5
                }
                open={
                  daten.prices['7abe5a10-1d6e-408a-af77-f8553e2c68e2'].status
                }
              />
            </Pressable>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.tabelle}>
            <Text style={styles.diesel}>Diesel</Text>
            <Text style={styles.e5}>Super</Text>
            <Text style={styles.e10}>Normal</Text>
          </View>
        </View>
      </View>
    );
};

export default Tanken;

function createStyles(colors, insets) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      //justifyContent: 'center',
      backgroundColor: colors.bg,
    } /*
    bildcontainer: {
      flex: 1,
      resizeMode: 'contain',
      //height: '93%',
      width: '100%',
      alignItems: 'center',
      backgroundColor: colors.bg,
    },*/,
    full: {
      width: '85%',
      height: '100%',
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
    tabelle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    karte: {
      width: '31%',
    },
    text: {
      paddingHorizontal: 10,
      fontFamily: 'roboto-bold',
      fontSize: 14,
      color: colors.text,
      textAlign: 'center',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '85%',
      elevation: 6,
      borderRadius: 10,
      backgroundColor: colors.bglight, // Nutzt die hellere Hintergrundfarbe
      borderColor: colors.border, // Nutzt die Rahmenfarbe
      borderWidth: 1,
      marginTop: 5,
      marginBottom: insets.bottom + 5,
    },
    diesel: {
      flex: 1,
      fontFamily: 'roboto-bold',
      fontSize: 12,
      color: colors.weiss,
      backgroundColor: colors.primary,
      textAlign: 'center',
      paddingVertical: 6,
      marginHorizontal: 3,
      borderRadius: 10,
    },
    e5: {
      flex: 1,
      fontFamily: 'roboto-bold',
      fontSize: 12,
      color: colors.weiss,
      backgroundColor: colors.border,
      textAlign: 'center',
      paddingVertical: 6,
      marginHorizontal: 3,
      borderRadius: 10,
    },
    e10: {
      flex: 1,
      fontFamily: 'roboto-bold',
      fontSize: 12,
      color: colors.weiss,
      backgroundColor: colors.bordermuted,
      textAlign: 'center',
      paddingVertical: 6,
      marginHorizontal: 3,
      borderRadius: 10,
    },
  });
}
