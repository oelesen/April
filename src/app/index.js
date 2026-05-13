import { Link } from 'expo-router';
import React from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
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
      </View>
    </ImageBackground>
  );
};

export default Index;

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
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
