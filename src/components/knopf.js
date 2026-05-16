import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const Knopf = (props) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  //Farbwechsel: Farbe und Textfarbe werden über Props übergeben, damit der Knopf flexibel einsetzbar ist
  let col = props.farbe;
  //Textfarbe wird ebenfalls über Props übergeben, damit sie zum Hintergrund passt (z.B. weiß auf dunklem Hintergrund, schwarz auf hellem Hintergrund)
  let textfarbe = props.textfarbe;
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={props.ziel}>
      <View style={{ ...styles.button, ...col }}>
        <Text style={{ ...styles.buttonText, ...textfarbe }}>
          {props.beschriftung}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function createStyles(colors) {
  return StyleSheet.create({
    button: {
      justifyContent: 'center',
      alignContent: 'center',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 12,
      margin: 5,
      minWidth: 90,
      backgroundColor: colors.primary, // Nutzt die hellere Hintergrundfarbe
      borderColor: colors.border, // Nutzt die Rahmenfarbe
      borderWidth: 1,
    },
    buttonText: {
      textAlign: 'center',
      //color: colors.bg,
      fontFamily: 'roboto-bold',
      fontSize: 12,
    },
  });
}

export default Knopf;
