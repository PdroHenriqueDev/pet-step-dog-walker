import React from 'react';
import styles from './styles';
import {ActivityIndicator, View} from 'react-native';
import colors from '../../styles/colors';

export default function Spinner({
  size = 'large',
}: {
  size?: number | 'small' | 'large' | undefined;
}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.secondary} size={size} />
    </View>
  );
}
