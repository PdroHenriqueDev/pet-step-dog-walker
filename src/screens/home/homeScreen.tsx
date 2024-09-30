import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Switch, Text, View} from 'react-native';
import colors from '../../styles/colors';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../../contexts/authContext';
import {balance} from '../../services/payment';
import {AxiosError} from 'axios';
import {useDialog} from '../../contexts/dialogContext';
import Spinner from '../../components/spinner/spinner';
import {PlataformEnum} from '../../enum/platform.enum';
import {PERMISSIONS, request} from 'react-native-permissions';
import {Linking} from 'react-native';
import GetLocation from 'react-native-get-location';
import {updateAvailability} from '../../services/dogWalkerService';
import {ActivityIndicator} from 'react-native';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {WalkEvents} from '../../enum/walk';
import CustomButton from '../../components/customButton';

const walkScreens = {
  [WalkEvents.PENDING]: 'WalkRequest',
  [WalkEvents.ACCEPTED_SUCCESSFULLY]: 'WalkInProgress',
  [WalkEvents.IN_PROGRESS]: 'WalkMap',
} as any;

export default function HomeScreen() {
  const {user} = useAuth();
  const {showDialog, hideDialog} = useDialog();
  const {navigation} = useAppNavigation();

  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (!user?.stripeAccountId) return;
      setIsLoading(true);
      setIsOnline(user?.isOnline ?? false);
      const fetchBalance = async () => {
        try {
          const data = await balance(user.stripeAccountId!);
          if (data) {
            setAvailableBalance(data.available[0].amount / 100);
            setPendingBalance(data.pending[0].amount / 100);
          }
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

      fetchBalance();
    }, [hideDialog, showDialog, user?.isOnline, user?.stripeAccountId]),
  );

  useEffect(() => {
    if (user?.currentWalk) {
      const {status} = user?.currentWalk;

      navigation.navigate(walkScreens[status]);
    }
  }, [navigation, user?.currentWalk]);

  const goToWalkInProgress = () => {
    if (user?.currentWalk) {
      const {status} = user?.currentWalk;
      navigation.navigate(walkScreens[status]);
    }
  };

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Erro ao abrir as configurações');
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    const requestResponse = await request(
      Platform.OS === PlataformEnum.IOS
        ? PERMISSIONS.IOS.LOCATION_ALWAYS
        : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    );

    if (['denied', 'blocked'].includes(requestResponse)) {
      showDialog({
        title: 'Permissão de Localização Necessária',
        description:
          'Para se manter online, precisamos acessar sua localização. Por favor, habilite a localização nas configurações do seu dispositivo.',
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

      return false;
    }

    return requestResponse === 'granted';
  };

  const getLocationUpdate = async (): Promise<boolean> => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
      });

      const {latitude, longitude} = location;
      await updateAvailability({
        isOnline: true,
        longitude,
        latitude,
      });
      return true;
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

      return false;
    }
  };

  const handleToggleSwitch = async (value: boolean) => {
    setSwitchLoading(true);
    try {
      if (value) {
        const permissionGranted = await requestLocationPermission();
        if (!permissionGranted) {
          setIsOnline(false);
          return;
        }

        const locationUpdated = await getLocationUpdate();
        setIsOnline(locationUpdated);

        return;
      }

      await updateAvailability({
        isOnline: false,
      });

      setIsOnline(false);
    } catch {
      showDialog({
        title: 'Erro ao atualizar status online.',
        description: 'Tente novamente mais tarde.',
        confirm: {
          confirmLabel: 'Entendi',
          onConfirm: () => {
            hideDialog();
          },
        },
      });
    } finally {
      setSwitchLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary p-5">
      <Spinner visible={isLoading} transparent={true} />
      {user?.currentWalk ? (
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-dark mb-2 text-center">
            Você tem um passeio em andamento
          </Text>
          <CustomButton
            label={'Ir para a tela do passeio'}
            onPress={goToWalkInProgress}
          />
        </View>
      ) : (
        <>
          <Text className="text-2xl font-bold text-dark mb-2">Seus ganhos</Text>
          {!user?.stripeAccountId ? (
            <Text className="text-danger text-lg">
              Você precisa adicionar um conta para ver seus ganhos
            </Text>
          ) : (
            <View className="flex-row justify-between">
              <View className="w-36 justify-center py-6 px-2 border border-gray-300 rounded-2xl">
                <Text className="font-semibold text-2xl text-dark">
                  R$ {availableBalance.toFixed(2)}
                </Text>
                <Text className="text-xs text-green">Disponível</Text>
              </View>

              <View className="w-36 justify-center py-6 px-2 border border-gray-300 rounded-2xl">
                <Text className="font-semibold text-2xl text-dark">
                  R$ {pendingBalance.toFixed(2)}
                </Text>
                <Text className="text-xs text-danger">Em processamento</Text>
              </View>
            </View>
          )}

          <View className="flex-row items-center mt-6">
            {switchLoading ? (
              <ActivityIndicator color={colors.secondary} size={'small'} />
            ) : (
              <Switch
                trackColor={{false: '#E6E6E6', true: colors.green}}
                thumbColor={isOnline ? colors.dark : colors.primary}
                ios_backgroundColor="#E6E6E6'"
                onValueChange={handleToggleSwitch}
                value={isOnline}
                disabled={switchLoading}
              />
            )}

            <Text className="ml-3 text-base text-dark font-semibold">
              Estou aceitando passeios
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
