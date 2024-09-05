export interface CustomTextInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  isEditable?: boolean;
  error?: string;
}
