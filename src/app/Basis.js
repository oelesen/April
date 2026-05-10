import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const Basis = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View>
      <Text>Basis</Text>
    </View>
  );
};

export default Basis;

function createStyles(colors) {
  return StyleSheet.create({});
}
