import React, {useState} from 'react';
import {View, Text, Image, Alert} from 'react-native';
import {
  MediaType,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import CustomButton from '../../../components/customButton';
import {useAppNavigation} from '../../../hooks/useAppNavigation';
import {uploadDocument} from '../../../services/application';
import {DocumentType} from '../../../types/document';
import {UploadableFile} from '../../../interfaces/document';
import {AxiosError} from 'axios';
import {useDialog} from '../../../contexts/dialogContext';

export default function PhotoCaptureScreen() {
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const {route, navigation} = useAppNavigation();
  const {documentType} = route.params as {documentType: DocumentType};
  const {showDialog, hideDialog} = useDialog();

  const [isLoading, setIsLoading] = useState(false);

  const documentLabel: {[key: string]: string} = {
    document: 'documento',
    selfie: 'selfie',
    residence: 'comprovante de residência',
    criminalRecord: 'certidão negativa de antecedentes criminais',
    aboutMe: 'sobre mim',
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

  const handleUploadDocument = async () => {
    if (!documentType || !photoUri) return;

    setIsLoading(true);

    const filePath = photoUri as string;
    const fileName = filePath.split('/').pop() as string;
    const fileType = 'image/jpeg';

    const file: UploadableFile = {
      uri: filePath,
      name: fileName,
      type: fileType,
    };

    try {
      await uploadDocument({
        documentType,
        documentFile: file,
      });
      navigation.navigate('Documents', {
        documentType,
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

  const openCamera = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
    };

    launchCamera(options, response => {
      if (!response.assets) return;
      setPhotoUri(response.assets[0].uri);
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (!response.assets) return;
      setPhotoUri(response.assets[0].uri);
    });
  };

  return (
    <View className="bg-primary flex-1 px-5 pt-16 items-center">
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
        onPress={photoUri ? handleUploadDocument : selectImage}
        isLoading={isLoading}
      />
    </View>
  );
}
