import {KeyboardTypeOptions} from 'react-native';

export interface CustomTextInputProps {
  value: string;
  onChangeText?: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  isEditable?: boolean;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
}
