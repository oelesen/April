import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';

export default function Index() {
  const [thema, setThema] = useState('light'); // State variable to track the current theme (light or dark)
  //////////////////////////////////////////////////////////////////////////////////////
  //beim ersten Aufruf wird zunächst das dark Theme eingestellt, damit die App nicht mit einem weißen Hintergrund startet
  useEffect(() => {
    setThema('light');
  }, []);
  ///////////////////////////////////////////////////////////////////////////////////////
  //hier werden die Styles erstellt, basierend auf dem aktuellen Thema (thema) und den Farben aus Colors.js. Dadurch wird sichergestellt,
  // dass die App das richtige Farbschema verwendet, je nachdem ob das dunkle oder helle Thema ausgewählt ist.
  const styles = createStyles(thema, Colors); // Create styles based on the current theme
  ///////////////////////////////////////////////////////////////////////////////////////
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
function createStyles(thema, Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[thema].bgdark,
    },
    text: {
      color: Colors[thema].text,
    },
  });
}
