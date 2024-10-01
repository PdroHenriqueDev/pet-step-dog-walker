import {BackHandler, Text, Vibration, View} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {
  acceptRequest,
  denyRequest,
  getRequestById,
} from '../../../services/walk';
import {useAuth} from '../../../contexts/authContext';
import {useDialog} from '../../../contexts/dialogContext';
import {AxiosError} from 'axios';
import Spinner from '../../../components/spinner/spinner';
import {WalkDetails} from '../../../interfaces/walk';
import {Icon} from '@rneui/base';
import colors from '../../../styles/colors';
import {calculateDistance} from '../../../services/adress';
import CustomButton from '../../../components/customButton';
import {useAppNavigation} from '../../../hooks/useAppNavigation';
import {WalkEvents} from '../../../enum/walk';
import Sound from 'react-native-sound';

export default function WalkRequestScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState<WalkDetails>();
  const [distance, setDistance] = useState('');
  const [distanceIsLoading, setDistanceIsLoading] = useState(true);
  const [denyIsLoading, setDenyIsLoading] = useState(false);
  const [acceptIsLoading, setAcceptIsLoading] = useState(false);

  const {user, handleSetUser} = useAuth();
  const {showDialog, hideDialog} = useDialog();
  const {navigation} = useAppNavigation();

  const soundRef = useRef<Sound | null>(null);
  const vibrateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sound = new Sound('ping_sound.mp3', Sound.MAIN_BUNDLE, error => {
      if (!error) sound.setNumberOfLoops(-1).play();
    });
    soundRef.current = sound;

    const vibrateInterval = setInterval(() => {
      Vibration.vibrate(1000);
    }, 1500);

    vibrateIntervalRef.current = vibrateInterval;

    const onBackPress = () => true;
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      soundRef.current?.stop(() => soundRef.current?.release());

      clearInterval(vibrateIntervalRef.current!);
      Vibration.cancel();
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  useEffect(() => {
    const handleData = async () => {
      if (!user?.currentWalk?.requestId) return;
      try {
        const requestData = await getRequestById(user?.currentWalk?.requestId);
        const {displayData} = requestData;
        setDetails(displayData);
        console.log('got here handleData =>', displayData);
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

  useEffect(() => {
    const handleDistance = async () => {
      if (!user) return;
      const {location} = user;
      if (!location || !details) return;

      try {
        const calculatedDistance = await calculateDistance({
          dogWalkerCoordinates: {
            latitude: location?.latitude,
            longitude: location?.longitude,
          },
          ownerCoordinates: {
            latitude: details.walk.receivedLocation.latitude,
            longitude: details.walk.receivedLocation.longitude,
          },
        });

        setDistance(calculatedDistance);
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError &&
          typeof error.response?.data?.data === 'string'
            ? error.response?.data?.data
            : 'Ocorreu um erro inesperado ao calcular a distância';
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
        setDistanceIsLoading(false);
      }
    };

    handleDistance();
  }, [details, hideDialog, showDialog, user]);

  const stopSoundAndVibration = () => {
    soundRef.current?.stop(() => soundRef.current?.release());
    clearInterval(vibrateIntervalRef.current!);
    Vibration.cancel();
  };

  const handleAccept = async () => {
    if (!user?.currentWalk?.requestId) return;
    setAcceptIsLoading(true);
    try {
      await acceptRequest(user?.currentWalk?.requestId);
      handleSetUser({
        ...user,
        currentWalk: {
          requestId: user?.currentWalk?.requestId,
          status: WalkEvents.ACCEPTED_SUCCESSFULLY,
        },
      });
      stopSoundAndVibration();
      navigation.navigate('WalkInProgress');
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
      setAcceptIsLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!user?.currentWalk?.requestId) return;
    setDenyIsLoading(true);
    try {
      await denyRequest(user?.currentWalk?.requestId);
      handleSetUser({
        ...user,
        currentWalk: null,
      });
      stopSoundAndVibration();
      navigation.goBack();
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
      setDenyIsLoading(false);
    }
  };

  return (
    <View className="bg-primary flex-1 p-5">
      <Spinner visible={isLoading} />
      <Text className="text-xl font-bold text-dark text-center">
        Detalhe do passeio
      </Text>
      <View className="mt-5 flex-row justify-between">
        <View className="flex-row items-center">
          <Text className="text-base text-dark font-semibold mr-2">
            {details?.owner.name}
          </Text>
          <Icon type="feather" name="star" size={14} color={colors.dark} />
          <Text className="ml-1">{details?.owner.rate}</Text>
        </View>
        <View>
          <Text className="text-base text-dark font-semibold">
            R$ {details?.walk.finalCost}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row justify-between">
        <View className="flex-row items-center">
          <Text className="text-base text-dark font-semibold">Passeio:</Text>
          <Text className="ml-1 text-base text-accent">
            {details?.walk.durationMinutes} min
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-base text-dark font-semibold">
            Quant. de Dogs:
          </Text>
          <Text className="ml-1 text-base text-accent">
            {details?.walk.numberOfDogs}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row">
        <View className="flex-row items-center">
          <Text className="text-base text-dark font-semibold">Distância:</Text>
          <Text className="ml-1 text-base text-accent text-center">
            {distanceIsLoading
              ? 'calculando...'
              : distance || 'não foi possível calcular'}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row">
        <View className="flex-row items-center">
          <Text className="text-base text-dark font-semibold">Endereço:</Text>
          <Text className="ml-1 text-base text-accent text-center">
            {details?.walk.receivedLocation.description}
          </Text>
        </View>
      </View>

      <View className="mt-5">
        <CustomButton
          label={'Aceitar passeio'}
          onPress={handleAccept}
          isLoading={acceptIsLoading}
        />
        <CustomButton
          label={'Negar passeio'}
          onPress={handleDeny}
          backgroundColor={colors.primary}
          isLoading={denyIsLoading}
        />
      </View>

      <View />
    </View>
  );
}
