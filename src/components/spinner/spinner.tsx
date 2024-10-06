import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';
import colors from '../../styles/colors';

export default function Spinner({
  visible = true,
  size = 'large',
  transparent = false,
}: {
  visible?: boolean;
  transparent?: boolean;
  size?: number | 'small' | 'large' | undefined;
}) {
  return (
    <Modal animationType="fade" transparent={transparent} visible={visible}>
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color={colors.secondary} size={size} />
      </View>
    </Modal>
  );
}
