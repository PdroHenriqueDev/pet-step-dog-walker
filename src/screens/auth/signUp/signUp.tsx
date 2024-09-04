import React, {useState} from 'react';
import {View} from 'react-native';
import CustomTextInput from '../../../components/customTextInput/customTextInput';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <View className="mb-3">
        <CustomTextInput
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
        />
      </View>
      <View className="mb-3">
        <CustomTextInput
          value={name}
          onChangeText={setName}
          placeholder="Seu sobrenome"
        />
      </View>
      <View className="mb-3">
        <CustomTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Seu email"
        />
      </View>
      <View className="mb-3">
        <CustomTextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Sua senha"
          secureTextEntry={true}
        />
      </View>
      <View className="mb-3">
        <CustomTextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Confirme sua senha"
          secureTextEntry={true}
        />
      </View>
    </View>
  );
}
