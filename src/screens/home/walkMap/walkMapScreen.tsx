import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import styles from './styles';
import colors from '../../../styles/colors';
import {Avatar, Icon} from '@rneui/base';
import {useAuth} from '../../../contexts/authContext';
import CustomButton from '../../../components/customButton';
import {useDialog} from '../../../contexts/dialogContext';
import {walkById} from '../../../services/walk';
import {AxiosError} from 'axios';
import Spinner from '../../../components/spinner/spinner';
import {truncateText} from '../../../utils/textUtils';

export default function WalkMapScreen() {
  const {user} = useAuth();
  const {showDialog, hideDialog} = useDialog();

  const [region, setRegion] = useState({
    longitude: user?.location?.longitude ?? -23.5505,
    latitude: user?.location?.latitude ?? -46.6333,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [walkData, setWalkData] = useState({
    owner: {
      name: '',
    },
    durationMinutes: '',
  });

  const navigateToChat = () => {};

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
        onCancel: () => {
          hideDialog();
        },
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.currentWalk?.requestId) return;
      console.log('got here fetchData');
      try {
        const walk = await walkById(user?.currentWalk?.requestId);
        if (walk) {
          const {owner, durationMinutes} = walk;
          setWalkData({
            owner: {
              name: owner.name,
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
                uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
              }}
            />
            <Text className="font-semibold text-base text-dark ml-2.5">
              {truncateText({
                text: walkData.owner.name || '',
                maxLength: 25,
              })}
            </Text>
          </View>
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
        </View>

        <View className="flex-row my-2">
          <Text className="text-base text-dark">Tempo do passeio: </Text>
          <Text className="text-base text-accent">
            {walkData.durationMinutes} min
          </Text>
        </View>

        <CustomButton
          label={'Finalizar passeio'}
          onPress={completeWalk}
          backgroundColor={colors.danger}
          textColor={colors.primary}
        />
      </View>
    </View>
  );
}
