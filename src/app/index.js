import { Link } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
// WICHTIG: Importiere den Hook aus deinem ThemeContext um die Farben zu nutzen
import Schalter from '../components/schalter';
import { useTheme } from '../theme/ThemeContext';

const Index = () => {
  const { colors, isDark } = useTheme();

  const styles = createStyles(colors);
  //////////////////////////////////////////////////////////////////////////////
  //anhand von isDark wird das Hintergrundbild ausgewählt.
  // Je nachdem, ob der Nutzer den Dark Mode aktiviert hat oder nicht
  let hintergrundbild = isDark
    ? require('../assets/images/Bilder/inselBgDark.png')
    : require('../assets/images/Bilder/inselBgLight.png'); // Standardbild
  ///////////////////////////////////////////////////////////////////////////////
  return (
    <ImageBackground
      source={hintergrundbild}
      style={styles.bildcontainer}
      resizeMode="contain"
    >
      <ScrollView>
        <View style={styles.container}>
          <View>
            <Link href="/themenwahl" asChild>
              <Pressable>
                <Schalter beschriftung={'Themenwahl'} />
              </Pressable>
            </Link>
          </View>
          <View>
            <Link href="/wechselkurs" asChild>
              <Pressable>
                <Schalter beschriftung={'Wechselkurs'} />
              </Pressable>
            </Link>
          </View>
          <View>
            <Link href="/tide" asChild>
              <Pressable>
                <Schalter beschriftung={'Gezeiten'} />
              </Pressable>
            </Link>
          </View>
          <View>
            <Link href="/basis" asChild>
              <Pressable>
                <Schalter beschriftung={'Basis'} />
              </Pressable>
            </Link>
          </View>
          <View>
            <Link href="/apo" asChild>
              <Pressable>
                <Schalter beschriftung={'Apotheke'} />
              </Pressable>
            </Link>
          </View>
          <View>
            <Link href="/scn" asChild>
              <Pressable>
                <Schalter beschriftung={'SCN'} />
              </Pressable>
            </Link>
            <Link href="/seewetterbericht" asChild>
              <Pressable>
                <Schalter beschriftung={'Seewetterbericht'} />
              </Pressable>
            </Link>
            <Link href="/tanken" asChild>
              <Pressable>
                <Schalter beschriftung={'Tanken'} />
              </Pressable>
            </Link>
            <Link href="/faehre" asChild>
              <Pressable>
                <Schalter beschriftung={'FRS Sylt-Fähre'} />
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Index;

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      //backgroundColor: colors.bg, // Nutzt die Hintergrundfarbe aus dem Theme
    },
    buttonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    bildcontainer: {
      height: '100%',
      width: '100%',
      backgroundColor: colors.bgdark, // Nutzt die bgdark Farbe aus dem Theme für den Hintergrund der Bildkomponente
    },
  });
}
