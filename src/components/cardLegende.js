import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '../theme/ThemeContext';

const CardLegende = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.container}>
      {/* <View style={styles.buttoncard}> */}
      <Text style={styles.diesel}>Diesel</Text>
      <Text style={styles.e5}>Super</Text>
      <Text style={styles.e10}>Normal</Text>
      {/* </View> */}
    </View>
  );
};

export default CardLegende;

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    // buttoncard: {
    //   flex: 1,
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    //   alignItems: 'center',
    //   width: '100%',
    //   paddingTop: 5,
    //   paddingBottom: 5,
    //   marginTop: 5,
    //   marginHorizontal: 5,
    //   marginBottom: 5,
    //   elevation: 6,
    //   borderRadius: 10,
    //   backgroundColor: colors.bglight, // Nutzt die hellere Hintergrundfarbe
    //   borderColor: colors.border, // Nutzt die Rahmenfarbe
    //   borderWidth: 1,
    // },
    diesel: {
      flex: 0.3,
      fontFamily: 'roboto-bold',
      fontSize: 12,
      color: colors.weiss,
      backgroundColor: colors.primary,
      textAlign: 'center',
    },
    e5: {
      flex: 0.3,
      fontFamily: 'roboto-bold',
      fontSize: 12,
      color: colors.weiss,
      backgroundColor: colors.border,
      textAlign: 'center',
    },
    e10: {
      flex: 0.3,
      fontFamily: 'roboto-bold',
      fontSize: 12,
      color: colors.weiss,
      backgroundColor: colors.bordermuted,
      textAlign: 'center',
    },
  });
}
