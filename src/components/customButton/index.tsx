import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import styles from './styles';
import colors from '../../styles/colors';
import {CustomButtonProps} from '../../interfaces/customButton';

function CustomButton({
  label,
  onPress,
  backgroundColor = colors.secondary,
  textColor = colors.dark,
  style,
  disabled = false,
  isLoading = false,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={!isLoading || disabled ? onPress : undefined}
      style={[styles.button, {backgroundColor}, style]}
      disabled={disabled || isLoading}>
      {isLoading ? (
        <ActivityIndicator color={colors.primary} size="small" />
      ) : (
        <Text style={[styles.buttonText, {color: textColor}]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export default CustomButton;
