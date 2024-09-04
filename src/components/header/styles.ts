import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  iconContainer: {
    position: 'relative',
    padding: 5,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.border,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: colors.danger,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerInvisible: {
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  backIconContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.dark,
  },
});

export default styles;
