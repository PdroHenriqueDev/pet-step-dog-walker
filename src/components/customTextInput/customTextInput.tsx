import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {CustomTextInputProps} from '../../interfaces/customTextInput';

export default function CustomTextInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  isEditable = true,
  keyboardType,
}: CustomTextInputProps) {
  return (
    <View>
      <TextInput
        className="border border-border rounded-lg p-3 text-dark"
        placeholder={placeholder}
        placeholderTextColor="#0000004D"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={isEditable}
        keyboardType={keyboardType}
      />
      {error && <Text className="text-danger text-sm mt-1">{error}</Text>}
    </View>
  );
}
