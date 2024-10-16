import React, {useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import CustomButton from '../../../components/customButton';
import {useAppNavigation} from '../../../hooks/useAppNavigation';
import CustomPicker from '../../../components/customPicker/customPicker';
import colors from '../../../styles/colors';
import {profile} from '../../../services/application';
import {AxiosError} from 'axios';
import {useDialog} from '../../../contexts/dialogContext';

export default function ProfileScreen() {
  const {navigation} = useAppNavigation();
  const {showDialog, hideDialog} = useDialog();

  const [availability, setAvailability] = useState('');
  const [transport, setTransport] = useState('');
  const [dogExperience, setDogExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormComplete = availability && transport && dogExperience;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await profile({
        availability,
        transport,
        dogExperience,
      });
      navigation.navigate('Documents', {
        documentType: 'profile',
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
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      className="bg-primary flex-1 px-5 pt-16">
      <View className="flex-1 mb-32">
        <Text className="font-bold text-xl text-dark text-center mb-5">
          Seu Perfil
        </Text>

        <Text className="text-base text-dark mb-3">Disponibilidade</Text>
        <View className="bg-accent rounded-2xl mb-5">
          <CustomPicker
            selectedValue={availability}
            onValueChange={itemValue => setAvailability(itemValue)}
            label="Selecione sua disponibilidade"
            items={[
              {label: 'Todos os dias', value: 'everyDay'},
              {label: 'Apenas esporadicamente', value: 'occasionally'},
              {label: 'Fins de semana', value: 'weekends'},
            ]}
          />
        </View>

        <Text className="text-base text-dark mb-1">Meios de Locomoção</Text>
        <Text className="text-sm text-accent mb-2">
          A locomoção não é importante para o passeio em si, mas é essencial
          para chegar rapidamente até o tutor do dog.
        </Text>
        <View className="bg-accent rounded-2xl mb-5">
          <CustomPicker
            selectedValue={transport}
            onValueChange={itemValue => setTransport(itemValue)}
            label="Selecione seu meio de locomoção"
            items={[
              {label: 'Carro/Motocicleta', value: 'carMotorcycle'},
              {label: 'Aplicativos de transporte', value: 'rideSharing'},
              {label: 'Bicicleta', value: 'bicycle'},
              {label: 'A pé', value: 'onFoot'},
            ]}
          />
        </View>

        <Text className="text-base text-dark mb-3">Experiência com cães</Text>
        <View className="bg-accent rounded-2xl mb-5">
          <CustomPicker
            selectedValue={dogExperience}
            onValueChange={itemValue => setDogExperience(itemValue)}
            label="Selecione sua experiência com cães"
            items={[
              {
                label: 'Confortável com todos os tipos de cães',
                value: 'allDogs',
              },
              {label: 'Confortável com cães mansos', value: 'calmDogs'},
            ]}
          />
        </View>

        <CustomButton
          label="Enviar"
          onPress={handleSubmit}
          isLoading={isLoading}
          disabled={!isFormComplete}
          backgroundColor={isFormComplete ? colors.secondary : colors.accent}
        />
      </View>
    </ScrollView>
  );
}
