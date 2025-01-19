import React, {useState} from 'react';
import {View, Text, Image, Alert, Platform} from 'react-native';
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
import DocumentPicker from 'react-native-document-picker';
import colors from '../../../styles/colors';

export default function PhotoCaptureScreen() {
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [fileUri, setFileUri] = useState<string>();
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

  const documentSelected = photoUri || fileUri;

  const selectFile = async () => {
    if (documentType === 'criminalRecord') {
      Alert.alert(
        'Escolher Documento',
        'Selecione a origem do documento',
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
            text: 'Selecionar PDF',
            onPress: openDocumentPicker,
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      selectImage();
    }
  };

  const openDocumentPicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      setFileUri(res[0].uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        throw err;
      }
    }
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

  const confirmUpload = () => {
    Alert.alert(
      'Confirmação',
      `Você verificou ${documentType === 'selfie' ? 'a imagem' : 'o documento'} e tem certeza que deseja fazer o upload?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: handleUploadDocument,
        },
      ],
      {cancelable: true},
    );
  };

  const getFileType = (path: string): string => {
    if (Platform.OS === 'android' && path.startsWith('content://'))
      return 'application/pdf';
    if (path.endsWith('.pdf')) return 'application/pdf';
    if (path.endsWith('.png')) return 'image/png';
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
    return 'application/octet-stream';
  };

  const handleUploadDocument = async () => {
    if (!documentType || (!photoUri && !fileUri)) return;

    setIsLoading(true);

    const filePath = fileUri || photoUri;
    const fileName = filePath?.split('/').pop() as string;

    if (!filePath) return;

    const fileType = getFileType(filePath);

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

  const openCamera = async () => {
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

  const removeDocument = () => {
    fileUri && setFileUri('');
    photoUri && setPhotoUri('');
  };

  return (
    <View
      className={`bg-primary flex-1 items-center ${Platform.OS === 'ios' ? 'py-28 px-5' : 'px-5 pt-16'}`}>
      <Text className="font-bold text-xl text-dark text-center">
        {documentType === 'selfie'
          ? 'Tire sua selfie'
          : `Tire uma foto ${documentType === 'criminalRecord' ? 'da sua' : 'do seu'} ${documentLabel[documentType]}`}
      </Text>
      <Text className="text-base text-accent mb-5">
        Verifique se todas as informações estão legíveis
      </Text>

      {photoUri || fileUri ? (
        fileUri && fileUri.endsWith('.pdf') ? (
          <View className="bg-accent h-80 w-full justify-center items-center mb-5">
            <Text>PDF selecionado: {fileUri.split('/').pop()}</Text>
          </View>
        ) : (
          <Image
            source={{uri: photoUri || fileUri}}
            className="bg-accent h-80 w-full justify-center items-center mb-5"
          />
        )
      ) : (
        <View className="bg-accent h-80 w-full justify-center items-center mb-5">
          <Text>Imagem não disponível</Text>
        </View>
      )}

      <CustomButton
        label={photoUri || fileUri ? 'Enviar' : 'Selecionar Documento'}
        onPress={photoUri || fileUri ? confirmUpload : selectFile}
        isLoading={isLoading}
      />

      {documentSelected && (
        <CustomButton
          label={'Excluir'}
          onPress={removeDocument}
          disabled={isLoading}
          backgroundColor={colors.danger}
          textColor={colors.primary}
        />
      )}
    </View>
  );
}
