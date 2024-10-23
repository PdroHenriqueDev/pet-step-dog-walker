import {StyleSheet} from 'react-native';
import colors from './colors';

const globalStyles = StyleSheet.create({
  backgroudContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 10,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.dark,
  },
  label: {
    fontSize: 16,
    color: colors.dark,
  },
  button: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.dark,
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 5,
    borderColor: colors.border,
  },
  input: {
    width: '100%',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    borderRadius: 5,
    paddingLeft: 16,
  },
  tabar: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarContainerStyle: {
    backgroundColor: 'red',
  },
  tabBarLabel: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 12,
    color: colors.accent,
  },
  headerTitle: {
    color: colors.dark,
    fontSize: 24,
    fontWeight: 600,
  },
  headerSubtitle: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: 500,
  },
  selectedText: {
    color: colors.dark,
    alignSelf: 'center',
    fontSize: 10,
  },
});

export default globalStyles;
