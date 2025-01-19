import {
  BackHandler,
  Platform,
  ScrollView,
  Text,
  Vibration,
  View,
} from 'react-native';
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

const sizeTranslate: {[key: string]: string} = {
  small: 'pequeno',
  medium: 'médio',
  large: 'grande',
};

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
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => {
      soundRef.current?.stop(() => soundRef.current?.release());

      clearInterval(vibrateIntervalRef.current!);
      Vibration.cancel();
      subscription.remove();
    };
  }, []);

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
      navigation.goBack();
    } finally {
      setAcceptIsLoading(false);
    }
  };

  const handleDeny = () => {
    showDialog({
      title: 'Tem certeza?',
      description: 'Quer mesmo negar o passeio?',
      confirm: {
        confirmLabel: 'Não',
        onConfirm: () => {
          hideDialog();
        },
      },
      cancel: {
        cancelLabel: 'Sim',
        onCancel: async () => {
          await denyWalk();
          hideDialog();
        },
      },
    });
  };

  const denyWalk = async () => {
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
      navigation.goBack();
    } finally {
      setDenyIsLoading(false);
    }
  };

  return (
    <ScrollView
      className={`bg-primary flex-1 pb-40 ${Platform.OS === 'ios' ? 'px-5 py-20' : 'p-5'}`}>
      <Spinner visible={isLoading} />
      <Text className="text-xl font-bold text-dark text-center">
        Detalhes do passeio
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

      <View className="mt-5">
        <View className="flex flex-row flex-wrap">
          {details?.walk.dogs?.map((dog, index) => (
            <View
              key={index}
              className="w-1/2 p-3 border rounded-lg border-border">
              <Text className="text-dark text-base font-semibold">
                Cão {index + 1}
              </Text>
              <Text className="text-dark text-sm">
                Raça: {dog.breed === 'unknown breed' ? 'SRD' : dog.breed}
              </Text>
              <Text className="text-dark text-sm">
                Porte: {sizeTranslate[dog.size]}
              </Text>
            </View>
          ))}
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
    </ScrollView>
  );
}
