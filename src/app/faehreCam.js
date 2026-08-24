import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import Zoom from 'react-native-zoom-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const breite = Math.floor(windowWidth) - 30;

// Basis-URLs der drei Webcams (ohne Cache-Buster, der kommt beim Fetch dazu)
const CAM_URL_1 =
  'https://www.frs-syltfaehre.de/webcam-image.jpg?tx_frsfrs_pi6%5BcontentElementUid%5D=1875&cHash=aa160392248a63886d55a44a97e9b1b6';
const CAM_URL_2 =
  'https://www.frs-syltfaehre.de/webcam-image.jpg?tx_frsfrs_pi6%5BcontentElementUid%5D=1874&cHash=af3ce595b4d662ddbf62ebb886443b9e';
const CAM_URL_3 =
  'https://www.frs-syltfaehre.de/webcam-image.jpg?tx_frsfrs_pi6%5BcontentElementUid%5D=1753&cHash=de4a3a9ce1d6c481ffbed33d91c0f937';

/////////////////////////////////////////////////////////////////////////////////
// fetchImageAsDataUri:
// Lädt ein Bild NICHT über die <Image>-Komponente (die auf iOS/Android eigene
// native Caches hat, die sich über Props wie "cachePolicy" oder "cache" nicht
// immer zuverlässig abschalten lassen), sondern manuell per fetch() als
// Roh-Bytes. Diese werden anschließend in eine Base64-"data:"-URI umgewandelt.
//
// Der entscheidende Vorteil: Eine data:-URI ist KEIN Netzwerk-Request mehr,
// sondern nur ein String mit den Bilddaten direkt eingebettet. Es gibt also
// gar nichts mehr, was irgendein Cache (App-intern oder Betriebssystem)
// zwischenspeichern und stattdessen ausliefern könnte. Jeder Aufruf dieser
// Funktion garantiert damit ein wirklich frisches Bild.
/////////////////////////////////////////////////////////////////////////////////
async function fetchImageAsDataUri(baseUrl) {
  // Zusätzlicher Cache-Buster als Query-Parameter, damit auch ein
  // eventueller CDN/Proxy VOR dem Server nicht aus seinem eigenen Cache
  // antwortet, sondern das Bild wirklich neu vom Ursprungsserver holt.
  const url = `${baseUrl}&_=${Date.now()}`;

  const response = await fetch(url, {
    // Weist auch den nativen HTTP-Client an, keine zwischengespeicherte
    // Antwort zu verwenden, sondern wirklich neu vom Netzwerk zu laden.
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Webcam-Bild konnte nicht geladen werden: ${response.status}`,
    );
  }

  const blob = await response.blob();

  // Blob -> Base64-Data-URI (funktioniert in React Native über FileReader)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // z.B. "data:image/jpeg;base64,...."
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const FaehreCam = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);

  // Für jede der drei Kameras merken wir uns die aktuelle Data-URI.
  // Solange noch kein neues Bild geladen wurde, bleibt das alte einfach
  // stehen (kein Flackern/Leerlauf während des 30-Sekunden-Refreshs).
  const [imageData1, setImageData1] = useState(null);
  const [imageData2, setImageData2] = useState(null);
  const [imageData3, setImageData3] = useState(null);

  /////////////////////////////////////////////////////////////////////////////////
  // loadAllImages: lädt alle drei Webcam-Bilder parallel neu und aktualisiert
  // den jeweiligen State erst, wenn das entsprechende Bild fertig geladen ist.
  /////////////////////////////////////////////////////////////////////////////////
  const loadAllImages = useCallback(async () => {
    // Promise.allSettled statt Promise.all: Falls z.B. eine Kamera gerade
    // nicht erreichbar ist, sollen die anderen beiden trotzdem aktualisiert
    // werden, statt dass alle drei wegen eines Fehlers hängen bleiben.
    const results = await Promise.allSettled([
      fetchImageAsDataUri(CAM_URL_1),
      fetchImageAsDataUri(CAM_URL_2),
      fetchImageAsDataUri(CAM_URL_3),
    ]);

    if (results[0].status === 'fulfilled') setImageData1(results[0].value);
    else console.warn('Fehler beim Laden von Kamera 1:', results[0].reason);

    if (results[1].status === 'fulfilled') setImageData2(results[1].value);
    else console.warn('Fehler beim Laden von Kamera 2:', results[1].reason);

    if (results[2].status === 'fulfilled') setImageData3(results[2].value);
    else console.warn('Fehler beim Laden von Kamera 3:', results[2].reason);
  }, []);

  //////////////////////////////////////////////////////////////////////////////////
  // Beim Mounten sofort einmal laden, danach alle 30 Sekunden erneut.
  //////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    loadAllImages(); // erster Abruf direkt beim Öffnen des Screens

    const timer = setInterval(() => {
      loadAllImages();
    }, 30000);

    return () => clearInterval(timer);
  }, [loadAllImages]);

  return (
    <View style={styles.container}>
      <ScrollView persistentScrollbar={true}>
        <View style={styles.tafel}>
          <Text style={styles.text}>Vielen Dank an die FRS Syltfähre</Text>
          <View style={styles.bilderrahmen2}>
            <Zoom>
              {imageData1 ? (
                <Image
                  source={{ uri: imageData1 }}
                  style={{ width: breite, height: 300 }}
                  resizeMode="contain"
                />
              ) : (
                // Solange das erste Bild noch nie geladen wurde: Ladeanzeige
                <View
                  style={[styles.platzhalter, { width: breite, height: 300 }]}
                >
                  <ActivityIndicator color={colors.text} />
                </View>
              )}
            </Zoom>
          </View>
          <Text style={styles.text}>Anleger in List</Text>
          <View style={styles.bilderrahmen2}>
            <Zoom>
              {imageData2 ? (
                <Image
                  source={{ uri: imageData2 }}
                  style={{ width: breite, height: 300 }}
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={[styles.platzhalter, { width: breite, height: 300 }]}
                >
                  <ActivityIndicator color={colors.text} />
                </View>
              )}
            </Zoom>
          </View>
          <Text style={styles.text}>Unten: Anleger Havneby</Text>
          <View style={styles.bilderrahmen2}>
            <Zoom>
              {imageData3 ? (
                <Image
                  source={{ uri: imageData3 }}
                  style={{ width: breite, height: 300 }}
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={[styles.platzhalter, { width: breite, height: 300 }]}
                >
                  <ActivityIndicator color={colors.text} />
                </View>
              )}
            </Zoom>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FaehreCam;

function createStyles(colors, insets) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bglight,
      marginBottom: insets.bottom,
    },
    tafel: {
      width: windowWidth - 20,
    },
    bilderrahmen: {
      flex: 1,
    },
    bilderrahmen2: {
      height: 'auto',
      width: breite,
    },
    platzhalter: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      textAlign: 'center',
      color: colors.text,
      fontFamily: 'roboto-bold',
      fontSize: 12,
      paddingTop: 5,
    },
  });
}
