import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Text, TouchableOpacity, View} from 'react-native';
import CustomTextInput from '../../../components/customTextInput/customTextInput';
import CustomButton from '../../../components/customButton';
import {login} from '../../../services/auth';
import {AxiosError} from 'axios';
import {useDialog} from '../../../contexts/dialogContext';
import {useAuth} from '../../../contexts/authContext';
import {signInWithCustomToken} from 'firebase/auth';
import {auth} from '../../../../firebaseConfig';

export default function SignIn() {
  const {setIsLoading, storeTokens, isLoading} = useAuth();

  const {showDialog, hideDialog} = useDialog();

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await login({
        email,
        password,
      });

      const {accessToken, refreshToken, firebaseToken, user} = response;

      await signInWithCustomToken(auth, firebaseToken);
      await storeTokens(accessToken, refreshToken, user._id);
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

  const handleForgotPassword = () => {
    console.log('Esqueceu a senha?');
  };

  return (
    <View>
      <View className="mb-3">
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email é obrigatório',
            pattern: {value: /\S+@\S+\.\S+/, message: 'Email inválido'},
          }}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('email', text, {shouldValidate: true})
              }
              placeholder="email"
              error={errors.email?.message}
              isEditable={!isLoading}
            />
          )}
        />
      </View>
      <View className="mb-3">
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Senha é obrigatória',
            minLength: {
              value: 8,
              message: 'A senha deve ter no mínimo 8 caracteres',
            },
          }}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('password', text, {shouldValidate: true})
              }
              placeholder="senha"
              secureTextEntry={true}
              error={errors.password?.message}
              isEditable={!isLoading}
            />
          )}
        />
      </View>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text className="text-dark font-bold text-right mb-3">
          Esqueceu sua senha?
        </Text>
      </TouchableOpacity>

      <CustomButton
        label="Entar"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
    </View>
  );
}
