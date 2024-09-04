import {ButtonGroup} from '@rneui/base';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import SignIn from './signIn/signIn';
import SignUp from './signUp/signUp';

export default function AuthScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const buttons = ['Login', 'Registro'];

  return (
    <View className="flex-1 px-5 bg-primary justify-center">
      <Text className="text-2xl font-bold text-center mb-2 text-dark">
        Entre na sua conta 👋
      </Text>
      <Text className="text-center text-accent mb-5">
        Preencha o formulário com suas credenciais para entrar na sua conta.
      </Text>
      <ButtonGroup
        onPress={setSelectedIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={styles.tabContainer}
        selectedButtonStyle={styles.selectedButton}
        textStyle={styles.tabText}
        selectedTextStyle={styles.selectedTabText}
        innerBorderStyle={styles.innerBorder}
      />
      {selectedIndex === 0 ? <SignIn /> : <SignUp />}
    </View>
  );
}
