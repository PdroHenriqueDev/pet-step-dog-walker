import axios from 'axios';
import Config from 'react-native-config';

export const fetchAddress = async (zipCode: string) => {
  try {
    const response = await axios.get(
      `https://viacep.com.br/ws/${zipCode}/json/`,
    );
    const {data} = response;

    if (data && !data.erro) {
      const {logradouro, bairro, localidade, uf} = data;
      return {logradouro, bairro, localidade, uf};
    }

    return {logradouro: '', bairro: '', localidade: '', uf: ''};
  } catch (error) {
    return {logradouro: '', bairro: '', localidade: '', uf: ''};
  }
};

export const calculateDistance = async ({
  dogWalkerCoordinates: {latitude: dogWalkerLat, longitude: dogWalkerLng},
  ownerCoordinates: {latitude: ownerLat, longitude: ownerLng},
}: {
  dogWalkerCoordinates: {latitude: number; longitude: number};
  ownerCoordinates: {latitude: number; longitude: number};
}) => {
  const origin = `${dogWalkerLat},${dogWalkerLng}`;
  const destination = `${ownerLat},${ownerLng}`;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${Config.GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === 'OK') {
      const distance = data.rows[0].elements[0]?.distance?.text ?? '';
      return distance;
    } else {
      throw new Error('Erro ao calcular a distância');
    }
  } catch (error) {
    throw new Error('Erro ao calcular a distância');
  }
};
