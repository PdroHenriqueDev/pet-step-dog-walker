import React from 'react';
import {TextInput} from 'react-native';
import {CustomTextInputProps} from '../../interfaces/customTextInput';

export default function CustomTextInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
}: CustomTextInputProps) {
  return (
    <TextInput
      className="border border-border rounded-lg p-3 text-dark"
      placeholder={placeholder}
      placeholderTextColor="#0000004D"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
}
