import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const Schalter = (props) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.button}>
      <Text style={styles.buttonText}>{props.beschriftung}</Text>
    </View>
  );
};

function createStyles(colors) {
  return StyleSheet.create({
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      width: screenWidth * 0.9,
      backgroundColor: colors.primary,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginHorizontal: 0,
      marginVertical: 8,
      borderRadius: 10,
      borderWidth: 0.8,
      borderColor: colors.weiss,
      borderStyle: 'solid',
      shadowColor: colors.border,
      shadowOpacity: 0.9,
      shadowRadius: 5,
      shadowOffset: { width: 1, height: 10 },
      elevation: 10,
    },
    buttonText: {
      textAlign: 'center',
      color: colors.bg,
      fontFamily: 'roboto-bold',
      fontSize: 16,
    },
  });
}

export default Schalter;
