import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import styles from './styles';
import colors from '../../../styles/colors';
import {Avatar, Icon} from '@rneui/base';
import {useAuth} from '../../../contexts/authContext';
import CustomButton from '../../../components/customButton';
import {useDialog} from '../../../contexts/dialogContext';
import {finalizeWalk, walkById} from '../../../services/walk';
import {AxiosError} from 'axios';
import Spinner from '../../../components/spinner/spinner';
import {truncateText} from '../../../utils/textUtils';
import {
  connectSocket,
  disconnectSocket,
  emitEvent,
} from '../../../services/socketService';
// import BackgroundTimer from 'react-native-background-timer';
import {PERMISSIONS, request} from 'react-native-permissions';
import GetLocation from 'react-native-get-location';
import {SocketResponse} from '../../../enum/socketResponse';
import {PlataformEnum} from '../../../enum/platform.enum';
import {useAppNavigation} from '../../../hooks/useAppNavigation';
import BackgroundService from 'react-native-background-actions';
import {delay} from '../../../utils/delay';
import EncryptedStorage from 'react-native-encrypted-storage';

// import {LogBox} from 'react-native';
// LogBox.ignoreLogs(['new NativeEventEmitter']);

const LOCATION_UPDATE_INTERVAL = 8000;

export default function WalkMapScreen() {
  const {user, handleSetUser} = useAuth();
  const {navigation} = useAppNavigation();
  const {showDialog, hideDialog} = useDialog();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    longitude: user?.location?.longitude ?? -23.5505,
    latitude: user?.location?.latitude ?? -46.6333,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [walkData, setWalkData] = useState({
    owner: {
      name: '',
      profileUrl: '',
    },
    durationMinutes: '',
  });
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const navigateToChat = () => {
    navigation.navigate('Chat');
  };

  const completeWalk = () => {
    showDialog({
      title: 'Tem certeza?',
      description:
        'Antes de finalizar o passeio, verifique se o tempo estimado foi cumprido. Prestar atenção ao tempo do passeio é importante para garantir que você ofereceu a experiência completa para o cliente.',
      confirm: {
        confirmLabel: 'Não',
        onConfirm: () => {
          hideDialog();
        },
      },
      cancel: {
        cancelLabel: 'Sim, tudo certo',
        onCancel: async () => {
          await handleFinalizeWalk();
          disconnectSocket();
          BackgroundService.stop();
          hideDialog();
          // BackgroundTimer.stopBackgroundTimer();
        },
      },
    });
  };

  const handleFinalizeWalk = async () => {
    if (!user?.currentWalk?.requestId) return;

    setIsFinalizing(true);
    try {
      await finalizeWalk(user?.currentWalk?.requestId);
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
      setIsFinalizing(false);
    }
  };

  useEffect(() => {
    const checkAndShowDialog = async () => {
      if (!user?.currentWalk?.requestId) return;

      try {
        const storedRequestsRaw =
          await EncryptedStorage.getItem('modalShownRequests');
        const storedRequests = storedRequestsRaw
          ? JSON.parse(storedRequestsRaw)
          : [];
        if (storedRequests.length > 1) {
          storedRequests.shift();
        }
        const isAlreadyShown = storedRequests.includes(
          user?.currentWalk?.requestId,
        );
        if (!isAlreadyShown) {
          Alert.alert(
            'Atenção!',
            'Para manter a localização atualizada para o tutor, você deve entrar periodicamente no aplicativo. Alguns dispositivos podem ter atrasos na atualização da localização quando o app está em segundo plano.',
            [
              {
                text: 'Entendi',
                onPress: async () => {
                  storedRequests.push(user?.currentWalk?.requestId);
                  await EncryptedStorage.setItem(
                    'modalShownRequests',
                    JSON.stringify(storedRequests),
                  );
                },
              },
            ],
            {cancelable: false},
          );
        }
      } catch {}
    };

    checkAndShowDialog();
  }, [user?.currentWalk?.requestId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.currentWalk?.requestId) return;
      try {
        const walk = await walkById(user?.currentWalk?.requestId);
        if (walk) {
          const {owner, durationMinutes} = walk;
          setWalkData({
            owner: {
              name: owner.name,
              profileUrl: owner?.profileUrl,
            },
            durationMinutes,
          });
        }
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

    fetchData();
  }, [hideDialog, showDialog, user?.currentWalk?.requestId]);

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Erro ao abrir as configurações');
    }
  };

  useEffect(() => {
    const setupLocationServices = async () => {
      const requestResponse = await request(
        Platform.OS === PlataformEnum.IOS
          ? PERMISSIONS.IOS.LOCATION_ALWAYS
          : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );

      if (['denied', 'blocked'].includes(requestResponse)) {
        showDialog({
          title: 'Permissão de Localização Necessária',
          description:
            'Para compartilhar com o tutor, precisamos acessar sua localização. Por favor, habilite a localização nas configurações do seu dispositivo.',
          confirm: {
            confirmLabel: 'Abrir Configurações',
            onConfirm: async () => {
              await openSettings();
              hideDialog();
            },
          },
          cancel: {
            cancelLabel: 'Cancelar',
            onCancel: () => {
              hideDialog();
            },
          },
        });

        return;
      }

      connectSocket(user?.currentWalk?.requestId!);
      // sendLocationToServer();
    };

    setupLocationServices();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendLocationToServer = async () => {
    if (isRequestingLocation) return;

    setIsRequestingLocation(true);
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });

      const {latitude, longitude} = location;

      if (
        Math.abs(latitude - region.latitude) > 0.0001 ||
        Math.abs(longitude - region.longitude) > 0.0001
      ) {
        emitEvent(SocketResponse.DogWalkerLocation, {latitude, longitude});

        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        };
        setRegion(newRegion);

        mapRef.current?.animateCamera({
          center: {latitude, longitude},
        });
      }
    } catch (error) {
    } finally {
      setIsRequestingLocation(false);
    }
  };

  // const startBackgroundTimer = () => {
  //   BackgroundTimer.runBackgroundTimer(() => {
  //     sendLocationToServer();
  //   }, LOCATION_UPDATE_INTERVAL);
  // };

  useEffect(() => {
    const handleBackground = async () => {
      const options = {
        taskName: 'BackgroundTask',
        taskTitle: 'Localização',
        taskDesc: 'Enviando localização em segundo plano para o tutor.',
        taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap',
        },
        color: '#F7CE45',
        linkingURI: 'petstep://home',
        parameters: {
          delay: LOCATION_UPDATE_INTERVAL,
        },
        progressBar: {
          max: 100,
          value: 100,
        },
      };

      const veryIntensiveTask = async (_taskData?: {delay: number}) => {
        while (BackgroundService.isRunning()) {
          await sendLocationToServer();
          await delay(LOCATION_UPDATE_INTERVAL);
        }
      };

      await BackgroundService.start(veryIntensiveTask, options);
      await BackgroundService.updateNotification({
        taskDesc: 'Localização sendo enviada',
      });
    };

    handleBackground();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <View className="flex-1 justify-end">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        showsUserLocation={false}>
        <Marker coordinate={region}>
          <Icon
            type="font-awesome-5"
            name="dog"
            size={30}
            color={colors.dark}
          />
        </Marker>
      </MapView>
      <View className="bg-primary p-4 border-t border-border">
        <Text className="text-base text-dark font-bold mb-4">Em rota...</Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Avatar
              rounded
              source={{
                uri:
                  walkData.owner?.profileUrl ||
                  'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
              }}
            />
            <Text className="font-semibold text-base text-dark ml-2.5">
              {truncateText({
                text: walkData.owner.name || '',
                maxLength: 25,
              })}
            </Text>
          </View>
          {!isFinalizing && (
            <TouchableOpacity
              className="flex-row items-center border border-border rounded-2xl p-2"
              onPress={navigateToChat}>
              <Icon
                className="mt-0.5 mr-1"
                type="material"
                name="message"
                size={14}
              />
              <Text className="text-sm text-dark">Conversar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row my-2">
          <Text className="text-base text-dark">Tempo do passeio: </Text>
          <Text className="text-base text-accent">
            {walkData.durationMinutes} min
          </Text>
        </View>

        <View className={Platform.OS === 'ios' ? 'mb-5' : ''}>
          <CustomButton
            label={'Finalizar passeio'}
            onPress={completeWalk}
            backgroundColor={colors.danger}
            textColor={colors.primary}
            isLoading={isFinalizing}
          />
        </View>
      </View>
    </View>
  );
}
