import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import CustomButton from '../../../components/customButton';
import {useAppNavigation} from '../../../hooks/useAppNavigation';
import colors from '../../../styles/colors';
import {aboutMeText} from '../../../services/application';
import {AxiosError} from 'axios';
import {useDialog} from '../../../contexts/dialogContext';

export default function AboutMeScreen() {
  const [aboutMe, setAboutMe] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const {navigation} = useAppNavigation();

  const {showDialog, hideDialog} = useDialog();

  const minCharacters = 100;
  const maxCharacters = 600;

  const handleSubmit = async () => {
    try {
      await aboutMeText(aboutMe);

      navigation.navigate('Documents', {
        documentType: 'aboutMe',
        success: true,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          typeof error.response?.data?.data === 'string'
            ? error.response?.data?.data
            : 'Ocorreu um erro inesperado';
        showDialog({
          title: message,
          confirm: {
            confirmLabel: 'Entendi',
            onConfirm: () => {
              hideDialog();
            },
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-primary flex-1 px-5 pt-16">
      <Text className="font-bold text-xl text-dark text-center">
        Fale um pouco sobre você
      </Text>
      <Text className="text-base text-accent mb-5 text-center">
        Descreva suas experiências e por que deseja ser um Dog Walker no Pet
        Step
      </Text>

      <TextInput
        className="bg-accent p-3 text-dark mb-5 h-40 rounded-2xl"
        placeholder="Escreva sobre suas experiências"
        value={aboutMe}
        onChangeText={setAboutMe}
        onFocus={() => setIsFocused(true)}
        multiline
        maxLength={maxCharacters}
      />

      <Text className="text-right text-sm text-accent mb-4">
        {aboutMe.length}/{maxCharacters} caracteres
      </Text>

      <CustomButton
        isLoading={isLoading}
        disabled={aboutMe.length < minCharacters}
        label="Enviar"
        onPress={handleSubmit}
        backgroundColor={
          aboutMe.length >= minCharacters ? colors.secondary : colors.accent
        }
      />

      {isFocused && aboutMe.length < minCharacters && (
        <Text className="text-center text-red-500 mt-2">
          Mínimo de {minCharacters} caracteres para enviar.
        </Text>
      )}
    </View>
  );
}
