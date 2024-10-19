import React, {useState} from 'react';
import {Platform, Text, TextInput, View} from 'react-native';
import {useAppNavigation} from '../../../hooks/useAppNavigation';
import CustomButton from '../../../components/customButton';

export default function UpdateUser() {
  const {route} = useAppNavigation();
  const {field} = route.params;
  const [value, setValue] = useState(field.value || '');

  const handleSave = () => {
    console.log('Novo valor salvo:', value);
  };

  return (
    <View
      className={`flex-1 items-center bg-primary ${Platform.OS === 'ios' ? 'px-5 py-20' : 'p-5'}`}>
      <Text className="text-dark text-2xl font-bold">{field.label}</Text>

      <View className="w-full my-5">
        <TextInput
          className="w-full border border-border p-5 rounded-2xl"
          value={value}
          onChangeText={setValue}
          placeholder={`Digite seu ${field.label.toLowerCase()}`}
        />
      </View>

      <CustomButton label={'Atualizar'} onPress={handleSave} />
    </View>
  );
}
