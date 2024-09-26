import {Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import {getRequestById} from '../../services/walk';
import {useAuth} from '../../contexts/authContext';
import {useDialog} from '../../contexts/dialogContext';
import {AxiosError} from 'axios';
import Spinner from '../../components/spinner/spinner';
import {WalkDetails} from '../../interfaces/walk';
import {Icon} from '@rneui/base';
import colors from '../../styles/colors';
import {calculateDistance} from '../../services/adress';
import CustomButton from '../../components/customButton';

export default function WalkRequestScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<WalkDetails>();
  const [distance, setDistance] = useState('');

  const {user} = useAuth();
  const {showDialog, hideDialog} = useDialog();

  useEffect(() => {
    const handleData = async () => {
      if (!user?.currentWalk?.requestId) return;
      setIsLoading(true);
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
      }
    };

    handleDistance();
  }, [details, hideDialog, showDialog, user]);

  const handleAccept = async () => {};
  const handleDeny = async () => {};

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
            {distance || 'calculando...'}
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
        <CustomButton label={'Aceitar passeio'} onPress={handleAccept} />
        <CustomButton
          label={'Negar passeio'}
          onPress={handleDeny}
          backgroundColor={colors.primary}
        />
      </View>

      <View />
    </View>
  );
}
