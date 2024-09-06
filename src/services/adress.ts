import axios from 'axios';

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
    console.error('Erro ao buscar endereço:', error);
    return {logradouro: '', bairro: '', localidade: '', uf: ''};
  }
};
