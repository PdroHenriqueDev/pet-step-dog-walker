import {useState} from 'react';
import {Alert, Platform, View} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import {useAuth} from '../../../contexts/authContext';
import {Avatar} from '@rneui/base';
import {PlataformEnum} from '../../../enum/platform.enum';
import CustomButton from '../../../components/customButton';
import colors from '../../../styles/colors';
import {uploadProfileImage} from '../../../services/dogWalkerService';
import {useAppNavigation} from '../../../hooks/useAppNavigation';
import {AxiosError} from 'axios';
import {useDialog} from '../../../contexts/dialogContext';

export default function UpdateProfileImgScreen() {
  const {user, handleSetUser} = useAuth();
  const {navigation} = useAppNavigation();
  const {showDialog, hideDialog} = useDialog();

  const [photoUri, setPhotoUri] = useState<string | undefined>(
    user?.profileUrl,
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectImageSource = () => {
    Alert.alert(
      'Selecionar Imagem',
      'Escolha de onde deseja selecionar a imagem',
      [
        {text: 'Câmera', onPress: openCamera},
        {text: 'Galeria', onPress: openGallery},
        {text: 'Cancelar', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const openCamera = async () => {
    const options = {mediaType: 'photo' as MediaType};
    const result = await launchCamera(options);
    if (result.assets) {
      setPhotoUri(result.assets[0].uri);
      //   await handleUploadImage(result.assets[0]);
    }
  };

  const openGallery = async () => {
    const options = {mediaType: 'photo' as MediaType};
    const result = await launchImageLibrary(options);
    if (result.assets) {
      setPhotoUri(result.assets[0].uri);
      //   await handleUploadImage(result.assets[0]);
    }
  };

  const handleUploadImage = async () => {
    setIsLoading(true);

    const fileName = photoUri?.split('/').pop() || 'profile';
    const fileType = photoUri?.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const file = {
      uri: photoUri!,
      name: fileName,
      type: fileType,
    };

    try {
      const url = await uploadProfileImage(file);
      handleSetUser({
        ...user,
        profileUrl: `${url}?timestamp=${new Date().getTime()}`,
      });

      Alert.alert('Sucesso', 'Imagem de perfil atualizado com sucesso!');
      navigation.navigate('AccountScreen');
      navigation;
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError &&
        typeof error.response?.data?.data === 'string'
          ? error.response?.data?.data
          : 'Ocorreu um erro inesperado';
      showDialog({
        title: errorMessage,
        confirm: {
          confirmLabel: 'Entendi',
          onConfirm: () => {
            hideDialog();
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View
      className={`flex-1 bg-primary justify-between items-center ${Platform.OS === PlataformEnum.IOS ? 'px-5 py-20' : 'p-5'}`}>
      <View className="mt-20">
        <Avatar
          rounded
          size={250}
          source={{
            uri:
              photoUri ||
              'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          }}
        />
      </View>

      {!photoUri ? (
        <CustomButton
          label={'Selecionar imagem'}
          onPress={selectImageSource}
          disabled={isLoading}
        />
      ) : (
        <View className="w-full">
          {photoUri !== user?.profileUrl && (
            <CustomButton
              label="Confirmar"
              onPress={handleUploadImage}
              isLoading={isLoading}
            />
          )}
          <CustomButton
            label="Selecionar outra"
            onPress={selectImageSource}
            backgroundColor={colors.primary}
            disabled={isLoading}
          />
        </View>
      )}
    </View>
  );
}
