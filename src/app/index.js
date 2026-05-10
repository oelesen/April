import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
// WICHTIG: Importiere den Hook aus deinem ThemeContext um die Farben zu nutzen
import Schalter from '../components/schalter';
import { useTheme } from '../theme/ThemeContext';

const Index = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
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
      backgroundColor: colors.bg, // Nutzt die Hintergrundfarbe aus dem Theme
    },
    buttonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
}
