import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
//import Colors from '../constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../theme/ThemeContext';

const { width, height } = Dimensions.get('screen');

const Map = () => {
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { name, strasse, plz, ort, lat, lon } = params;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /////////////////////////////////////////////////////////////////////////////
  //am Anfang wird die Erelaubnis zur Lokalisation geprüft
  //danach wird die aktuelle Location geholt und gespreichert
  useEffect(() => {
    (async () => {
      try {
        let { status: existingStatus } =
          await Location.getForegroundPermissionsAsync();
        let finalStatus;
        if (existingStatus === 'undetermined') {
          const { status } = await Location.requestForegroundPermissionsAsync();
          finalStatus = status;
        } else {
          finalStatus = existingStatus;
        }

        if (finalStatus !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        setMapRegion({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          longitudeDelta: 0.0922,
          latitudeDelta: 0.0421,
        });
      } catch (e) {
        setErrorMsg('Error fetching location');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////////////
  const Infos = () => {
    return (
      <View style={styles.Infozeile}>
        <Text style={styles.Infozeilentext}>{name}</Text>
        <Text style={styles.Infozeilentext}>{strasse}</Text>
        <Text style={styles.Infozeilentext}>
          {plz !== '' ? plz + ' ' + ort : ort}
        </Text>
      </View>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <Infos />
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={
            mapRegion ?? {
              latitude: 54.901073,
              longitude: 8.3399,
              latitudeDelta: 0.35,
              longitudeDelta: 0.35,
            }
          }
          showsUserLocation={true}
        >
          {mapRegion ? (
            <Marker
              coordinate={{
                longitude: mapRegion.longitude,
                latitude: mapRegion.latitude,
              }}
              title="Me"
              description="Myself"
            ></Marker>
          ) : null}
          <Marker
            coordinate={{
              longitude: parseFloat(lon),
              latitude: parseFloat(lat),
            }}
            title={name}
            description={strasse + ', ' + ort}
          ></Marker>
        </MapView>
      </View>
    </>
  );
};

//////////////////////////////////////////////////////////////////////////////////////////////////
function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bg,
    },
    map: {
      width: '100%',
      height: '100%',
    },
    Infozeile: {
      backgroundColor: colors.bg,
    },
    Infozeilentext: {
      fontWeight: 'bold',
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
    },
    markerImage: {
      width: 35,
      height: 35,
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
      padding: 8,
    },
  });
}
/////////////////////////////////////////////////////////////////////////////
export default Map;
