import {Alert, Image, Platform, Text, View} from 'react-native';
import {PlataformEnum} from '../../../../enum/platform.enum';
import {useState} from 'react';
import {useDialog} from '../../../../contexts/dialogContext';
import {useAppNavigation} from '../../../../hooks/useAppNavigation';
import DocumentPicker from 'react-native-document-picker';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import {uploadAccountDocument} from '../../../../services/dogWalkerService';
import {AxiosError} from 'axios';
import CustomButton from '../../../../components/customButton';
import colors from '../../../../styles/colors';
import {useAuth} from '../../../../contexts/authContext';

export default function BankUploadDocument() {
  const [documentUri, setDocumentUri] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const {showDialog, hideDialog} = useDialog();
  const {navigation} = useAppNavigation();
  const {user, handleSetUser} = useAuth();

  const selectFile = async () => {
    Alert.alert(
      'Escolher Documento',
      'Selecione a origem do documento',
      [
        {text: 'Câmera', onPress: openCamera},
        {text: 'Galeria', onPress: openGallery},
        {text: 'Selecionar PDF', onPress: openDocumentPicker},
        {text: 'Cancelar', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const openDocumentPicker = async () => {
    try {
      const res = await DocumentPicker.pick({type: [DocumentPicker.types.pdf]});
      setDocumentUri(res[0].uri);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) throw err;
    }
  };

  const openCamera = async () => {
    const options = {mediaType: 'photo' as MediaType};
    launchCamera(options, response => {
      if (response.assets) setDocumentUri(response.assets[0].uri);
    });
  };

  const openGallery = () => {
    const options = {mediaType: 'photo' as MediaType};
    launchImageLibrary(options, response => {
      if (response.assets) setDocumentUri(response.assets[0].uri);
    });
  };

  const confirmUpload = () => {
    if (!documentUri) return;
    Alert.alert(
      'Confirmação',
      'Você verificou o documento?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Confirmar', onPress: handleUploadDocument},
      ],
      {cancelable: true},
    );
  };

  const handleUploadDocument = async () => {
    if (!documentUri) return;

    setIsLoading(true);
    const fileName = documentUri.split('/').pop() || 'document';
    const fileType = documentUri.endsWith('.pdf')
      ? 'application/pdf'
      : documentUri.endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';

    const file = {
      uri: documentUri,
      name: fileName,
      type: fileType,
    };

    try {
      await uploadAccountDocument(file);
      handleSetUser({
        ...user,
        bank: {
          ...user!.bank!,
          bankDocumentSent: true,
        },
      });
      navigation.navigate('AccountScreen');
    } catch (error) {
      const message =
        error instanceof AxiosError &&
        typeof error.response?.data?.data === 'string'
          ? error.response?.data?.data
          : 'Ocorreu um erro inesperado';
      showDialog({
        title: message,
        confirm: {confirmLabel: 'Entendi', onConfirm: hideDialog},
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeDocument = () => setDocumentUri(undefined);
  return (
    <View
      className={`flex-1 bg-primary ${Platform.OS === PlataformEnum.IOS ? 'px-5 py-20' : 'p-5'}`}>
      <Text className="text-dark text-center mb-5 text-2xl font-bold">
        Upload do documento
      </Text>
      <Text className="text-base text-center text-accent mb-5">
        Verifique se todas as informações estão legíveis
      </Text>
      <Text className="text-sm text-center text-danger mb-5">
        O documento precisa estar totalmente visível na foto, incluindo frente e
        verso
      </Text>

      {documentUri ? (
        documentUri.endsWith('.pdf') ? (
          <View className="bg-accent h-80 w-full justify-center items-center mb-5">
            <Text>PDF selecionado: {documentUri.split('/').pop()}</Text>
          </View>
        ) : (
          <Image
            source={{uri: documentUri}}
            className="bg-accent h-80 w-full justify-center items-center mb-5"
          />
        )
      ) : (
        <View className="bg-accent h-80 w-full justify-center items-center mb-5">
          <Text>Imagem não disponível</Text>
        </View>
      )}

      <CustomButton
        label={documentUri ? 'Enviar' : 'Selecionar Documento'}
        onPress={documentUri ? confirmUpload : selectFile}
        isLoading={isLoading}
      />

      {documentUri && (
        <CustomButton
          label="Excluir"
          onPress={removeDocument}
          disabled={isLoading}
          backgroundColor={colors.danger}
          textColor={colors.primary}
        />
      )}
    </View>
  );
}
