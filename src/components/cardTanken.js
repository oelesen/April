import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const CardTanken = (props) => {
  /*
  const [name, setName] = useState(props.name);
  const [ort, setOrt] = useState(props.ort);
  const [open, setOpen] = useState(props.open);
  const [diesel, setDiesel] = useState(props.diesel);
  const [normale10, setNormale10] = useState(props.normale10);
  const [supere5, setSupere5] = useState(props.supere5);
  */
  const { colors } = useTheme();
  const styles = createStyles(colors);

  let bild;
  if (props.name === 'Aral') {
    bild = require('../assets/images/Bilder/Aral.png');
  }
  if (props.name === 'Shell') {
    bild = require('../assets/images/Bilder/Shell.png');
  }
  if (props.name === 'Star') {
    bild = require('../assets/images/Bilder/Star.png');
  }
  if (props.name === 'Elan') {
    bild = require('../assets/images/Bilder/Elan.png');
  }
  if (props.name === 'Unitol') {
    bild = require('../assets/images/Bilder/Unitol.png');
  }
  if (props.name === 'BfT') {
    bild = require('../assets/images/Bilder/Bft.png');
  }
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={bild} />
      <Text style={styles.buttonText}>{props.ort}</Text>
      <Text style={styles.diesel} numberOfLines={1}>
        {props.diesel}
      </Text>
      <Text style={styles.normal} numberOfLines={1}>
        {props.normale10}
      </Text>
      <Text style={styles.super} numberOfLines={1}>
        {props.supere5}
      </Text>
      <Text style={styles.buttonText}>{props.open}</Text>
    </View>
  );
};

export default CardTanken;

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
      marginTop: 2,
      marginBottom: 2,
      elevation: 6,
      borderRadius: 10,
      backgroundColor: colors.bglight, // Nutzt die hellere Hintergrundfarbe
      borderColor: colors.border, // Nutzt die Rahmenfarbe
      borderWidth: 1,
    },
    buttonText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: 'bold',
      //backgroundColor: colors.bg, // Nutzt die hellere Hintergrundfarbe
    },
    bildcontainer: {
      height: '100%',
      width: '100%',
      backgroundColor: colors.bg, // Nutzt die bgdark Farbe aus dem Theme für den Hintergrund der Bildkomponente
    },
    diesel: {
      width: '80%',
      paddingHorizontal: 4,
      fontFamily: 'roboto-bold',
      fontSize: 14,
      color: colors.weiss, // Nutzt die highlight Farbe aus dem Theme für den Text der Diesel-Komponente
      backgroundColor: colors.primary, // Nutzt die primary Farbe aus dem Theme für den Hintergrund der Diesel-Komponente
      textAlign: 'center',
    },
    normal: {
      width: '80%',
      paddingHorizontal: 4,
      fontFamily: 'roboto-bold',
      fontSize: 14,
      color: colors.weiss, // Nutzt die highlight Farbe aus dem Theme für den Text der Diesel-Komponente
      backgroundColor: colors.bordermuted, // Nutzt die primary Farbe aus dem Theme für den Hintergrund der Diesel-Komponente
      textAlign: 'center',
    },
    super: {
      width: '80%',
      paddingHorizontal: 4,
      fontFamily: 'roboto-bold',
      fontSize: 14,
      color: colors.weiss, // Nutzt die highlight Farbe aus dem Theme für den Text der Diesel-Komponente
      backgroundColor: colors.border, // Nutzt die primary Farbe aus dem Theme für den Hintergrund der Diesel-Komponente
      textAlign: 'center',
    },
    image: {
      width: '100%',
      height: 80,
      resizeMode: 'contain',
    },
  });
}
