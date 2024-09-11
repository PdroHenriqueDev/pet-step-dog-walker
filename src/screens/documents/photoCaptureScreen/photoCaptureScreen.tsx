import React, {useState} from 'react';
import {View, Text, Image, Alert} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '../../../components/customButton';
import {useAppNavigation} from '../../../hooks/useAppNavigation';

export default function PhotoCaptureScreen() {
  const [photoUri, setPhotoUri] = useState(null);
  const {route} = useAppNavigation();
  const {documentType} = route.params;

  const documentLabel: {[key: string]: string} = {
    document: 'documento',
    selfie: 'selfie',
    residence: 'comprovante de residência',
    criminalRecord: 'certidão negativa de antecedentes criminais',
  };

  const selectImage = () => {
    Alert.alert(
      'Escolher Imagem',
      'Selecione a origem da imagem',
      [
        {
          text: 'Câmera',
          onPress: openCamera,
        },
        {
          text: 'Galeria',
          onPress: openGallery,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('Usuário cancelou a câmera');
      } else if (response.errorCode) {
        console.log('Erro na câmera: ', response.errorMessage);
      } else {
        setPhotoUri(response.assets[0].uri);
      }
    });
  };

  // Função para abrir a galeria
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Usuário cancelou a galeria');
      } else if (response.errorCode) {
        console.log('Erro na galeria: ', response.errorMessage);
      } else {
        setPhotoUri(response.assets[0].uri);
      }
    });
  };

  return (
    <View className="bg-primary flex-1 p-5 items-center">
      <Text className="font-bold text-xl text-dark text-center">
        {documentType === 'selfie'
          ? 'Tire sua selfie'
          : `Tire uma foto ${documentType === 'criminalRecord' ? 'da sua' : 'do seu'} ${documentLabel[documentType]}`}
      </Text>
      <Text className="text-base text-accent mb-5">
        Verifique se todas as informações estão legíveis
      </Text>

      {photoUri ? (
        <Image
          source={{uri: photoUri}}
          className="bg-accent h-80 w-full justify-center items-center mb-5"
        />
      ) : (
        <View className="bg-accent h-80 w-full justify-center items-center mb-5">
          <Text>Imagem não disponível</Text>
        </View>
      )}

      <CustomButton
        label={photoUri ? 'Enviar' : 'Selecionar Imagem'}
        onPress={selectImage}
      />
    </View>
  );
}
