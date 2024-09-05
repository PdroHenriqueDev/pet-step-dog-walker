import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  tabContainer: {
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  selectedButton: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary,
  },
  tabText: {
    color: colors.accent,
  },
  selectedTabText: {
    fontWeight: 'bold',
    color: colors.dark,
  },
  innerBorder: {
    width: 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default styles;
