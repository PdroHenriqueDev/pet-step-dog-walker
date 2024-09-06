import {Dialog} from '@rneui/base';
import React from 'react';
import CustomButton from '../customButton';
import styles from './styles';
import {Text, View} from 'react-native';
import colors from '../../styles/colors';

function CustomDialog({
  isVisible = false,
  title,
  description,
  confirm,
  cancel,
  onBackdropPress,
}: {
  isVisible: boolean;
  title: string;
  description?: string;
  confirm?: {
    confirmLabel: string;
    onConfirm: () => void;
  };
  cancel?: {
    cancelLabel: string;
    onCancel: () => void;
  };
  onBackdropPress?: () => void;
}) {
  return (
    <Dialog
      overlayStyle={styles.dialog}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}>
      <Dialog.Title titleStyle={styles.title} title={title} />
      {description && <Text style={styles.description}>{description}</Text>}

      <View className="flex-col">
        {confirm && confirm.confirmLabel && confirm.onConfirm && (
          <CustomButton
            label={confirm.confirmLabel}
            onPress={confirm.onConfirm}
          />
        )}
        {cancel && cancel.cancelLabel && cancel.onCancel && (
          <CustomButton
            label={cancel.cancelLabel}
            onPress={cancel.onCancel}
            backgroundColor={colors.primary}
          />
        )}
      </View>
    </Dialog>
  );
}

export default CustomDialog;
