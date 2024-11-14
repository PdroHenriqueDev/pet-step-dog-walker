import React from 'react';
import {Text, View} from 'react-native';
import {xml} from '../../assets/logo.ts';
import {SvgXml} from 'react-native-svg';

export default function SplashScreen() {
  return (
    <View className="bg-primary flex-1 p-8 justify-center items-center">
      <SvgXml xml={xml} width="200" height="200" />
      <Text className="text-center text-xl text-dark mb-4">
        Seja bem-vindo(a)!
      </Text>
      <Text className="text-accent text-center text-base">
        Estamos muito felizes em tê-lo(a) conosco! No Pet Step, sabemos que você
        é peça fundamental para garantir que cada passeio seja uma experiência
        incrível para os cachorros e seus tutores. É por isso que nos dedicamos
        a oferecer o suporte e as ferramentas necessárias para você proporcionar
        o melhor serviço de dog walking possível.
      </Text>
    </View>
  );
}
