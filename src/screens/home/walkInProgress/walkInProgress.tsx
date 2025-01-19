import {Alert, Linking, Platform, Text, View} from 'react-native';
import CustomButton from '../../../components/customButton';
import {useEffect, useState} from 'react';
import {useAuth} from '../../../contexts/authContext';
import {WalkDetails} from '../../../interfaces/walk';
import {cancelWalk, getRequestById, startWalk} from '../../../services/walk';
import {AxiosError} from 'axios';
import {useDialog} from '../../../contexts/dialogContext';
import Spinner from '../../../components/spinner/spinner';
import colors from '../../../styles/colors';
import {useAppNavigation} from '../../../hooks/useAppNavigation';
import {WalkEvents} from '../../../enum/walk';
// import messaging from '@react-native-firebase/messaging';
// import {ref, update} from 'firebase/database';
// import {database} from '../../../../firebaseConfig';
// import EncryptedStorage from 'react-native-encrypted-storage';

export default function WalkInProgressScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState<WalkDetails>();

  const {showDialog, hideDialog} = useDialog();
  const {user, handleSetUser} = useAuth();
  const {navigation} = useAppNavigation();

  useEffect(() => {
    const handleData = async () => {
      if (!user?.currentWalk?.requestId) return;
      try {
        const requestData = await getRequestById(user?.currentWalk?.requestId);
        const {displayData} = requestData;
        setDetails(displayData);
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError &&
          typeof error.response?.data?.data === 'string'
            ? error.response?.data?.data
            : 'Ocorreu um erro inesperado ao carregar os detalhes';
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

    handleData();
  }, [hideDialog, showDialog, user?.currentWalk?.requestId]);

  // useEffect(() => {
  //   const updateNotificationToken = async () => {
  //     if (!user?.currentWalk?.requestId) return;
  //     try {
  //       const storedTokensRaw =
  //         await EncryptedStorage.getItem('notificationTokens');
  //       const storedTokens = storedTokensRaw ? JSON.parse(storedTokensRaw) : [];

  //       if (storedTokens.length > 1) {
  //         storedTokens.shift();
  //       }

  //       const token = await messaging().getToken();

  //       const isAlreadyStored = storedTokens.includes(token);
  //       if (isAlreadyStored) return;

  //       const tokenRef = ref(database, `chats/${user?.currentWalk?.requestId}`);

  //       await update(tokenRef, {
  //         dogWalkerToken: token,
  //       });

  //       storedTokens.push(token);
  //       await EncryptedStorage.setItem(
  //         'notificationTokens',
  //         JSON.stringify(storedTokens),
  //       );
  //     } catch (error) {
  //       console.log('Erro ao atualizar o token:', error);
  //     }
  //   };

  //   updateNotificationToken();
  // }, [user?.currentWalk?.requestId]);

  const openAppleMaps = () => {
    if (!details) return;

    const {walk} = details;
    const url = `maps:0,0?q=${walk.receivedLocation.latitude},${walk.receivedLocation.longitude}`;
    Linking.openURL(url);
  };

  const openGoogleMaps = () => {
    if (!details) return;

    const {walk} = details;

    const url = `https://www.google.com/maps/search/?api=1&query=${walk.receivedLocation.latitude},${walk.receivedLocation.longitude}`;
    Linking.openURL(url);
  };

  const handleIOSMaps = () => {
    Alert.alert(
      'Escolha o Mapa',
      'Qual aplicativo de mapas você quer usar?',
      [
        {text: 'Apple Maps', onPress: openAppleMaps},
        {text: 'Google Maps', onPress: openGoogleMaps},
        {text: 'Cancelar', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const handleMap = () => {
    Platform.OS === 'ios' ? handleIOSMaps() : openGoogleMaps();
  };

  const handleStartWalk = () => {
    showDialog({
      title: 'Confirmação de Início',
      description:
        'Você já está com o(s) cão(es) e pronto para iniciar o passeio?',
      confirm: {
        confirmLabel: 'Sim, estou pronto',
        onConfirm: async () => {
          await startWalkRequest();
          hideDialog();
        },
      },
      cancel: {
        cancelLabel: 'Não',
        onCancel: () => {
          hideDialog();
        },
      },
    });
  };

  const startWalkRequest = async () => {
    if (!user?.currentWalk) return;
    setIsLoading(true);
    try {
      await startWalk(user?.currentWalk?.requestId);
      handleSetUser({
        ...user,
        currentWalk: {
          ...user?.currentWalk,
          status: WalkEvents.IN_PROGRESS,
        },
      });
      navigation.navigate('WalkMap');
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError &&
        typeof error.response?.data?.data === 'string'
          ? error.response?.data?.data
          : 'Ocorreu um erro inesperado ao iniciar';

      showDialog({
        title: errorMessage,
        confirm: {
          confirmLabel: 'Entendi',
          onConfirm: () => {
            hideDialog();
          },
        },
      });
      navigation.navigate('HomeScreen');
    } finally {
      setIsLoading(false);
    }
  };
  const openChat = () => {
    navigation.navigate('Chat');
  };

  const confirmCancelWalk = async () => {
    if (!user?.currentWalk?.requestId) return;
    setIsLoading(true);
    try {
      await cancelWalk(user?.currentWalk?.requestId);
      handleSetUser({
        ...user,
        currentWalk: null,
      });
      navigation.navigate('HomeScreen');
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError &&
        typeof error.response?.data?.data === 'string'
          ? error.response?.data?.data
          : 'Ocorreu um erro inesperado ao cancelar';

      showDialog({
        title: errorMessage,
        confirm: {
          confirmLabel: 'Entendi',
          onConfirm: () => {
            hideDialog();
          },
        },
      });
      navigation.navigate('HomeScreen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelWalk = () => {
    showDialog({
      title: 'Tem certeza?',
      description:
        'Tem certeza de que deseja cancelar o passeio? Cancelar logo após aceitar pode impactar sua avaliação na plataforma.',
      confirm: {
        confirmLabel: 'Irei continuar o passeio',
        onConfirm: () => {
          hideDialog();
        },
      },
      cancel: {
        cancelLabel: 'Sim, quero cancelar',
        onCancel: async () => {
          hideDialog();
          await confirmCancelWalk();
        },
      },
    });
  };

  return (
    <View
      className={`bg-primary flex-1 flex-col justify-between ${Platform.OS === 'ios' ? 'px-5 py-20' : 'p-5'}`}>
      <Spinner visible={isLoading} transparent={true} />
      <View>
        <Text className="text-2xl font-bold text-dark mb-2 text-center">
          Passeio em andamento
        </Text>

        <Text className="text-base text-danger">
          Assim que estiver com o cão, lembre-se de iniciar o passeio para
          começar o acompanhamento.
        </Text>

        <View className="my-5 flex-row">
          <View className="flex-row items-center">
            <Text className="text-base text-dark font-semibold">Endereço:</Text>
            <Text className="ml-1 text-base text-accent ">
              {details?.walk.receivedLocation.description}
            </Text>
          </View>
        </View>

        <CustomButton
          label={'Abrir endereço no mapa'}
          onPress={handleMap}
          disabled={isLoading}
        />
      </View>

      <View>
        <CustomButton
          backgroundColor={colors.danger}
          textColor={colors.primary}
          label={'Iniciar o passeio'}
          onPress={handleStartWalk}
          disabled={isLoading}
        />
        <CustomButton
          label={'Conversar com o tutor'}
          onPress={openChat}
          disabled={isLoading}
        />
        <CustomButton
          backgroundColor={colors.primary}
          label={'Cancelar o passeio'}
          onPress={handleCancelWalk}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}
