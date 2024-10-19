import {ButtonGroup} from '@rneui/base';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import styles from './styles';
import SignIn from './signIn/signIn';
import SignUp from './signUp/signUp';

export default function AuthScreen() {
  const buttons = ['Login', 'Cadastro'];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleRegisterSuccess = () => {
    setSelectedIndex(0);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View
          className={`flex-1  bg-primary justify-center ${Platform.OS === 'ios' ? 'py-20 px-5' : 'p-5'}`}>
          <Text className="text-2xl font-bold text-center mb-2 text-dark">
            {selectedIndex === 0
              ? 'Entre na sua conta 👋'
              : 'Crie uma nova conta'}
          </Text>
          <Text className="text-center text-accent mb-5">
            {selectedIndex === 0
              ? 'Preencha o formulário com suas credenciais para entrar na sua conta. '
              : 'Preencha o formulário e crie uma nova conta'}
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
          {selectedIndex === 0 ? (
            <SignIn />
          ) : (
            <SignUp onRegister={handleRegisterSuccess} />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
