import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Platform, Text, View} from 'react-native';
import CustomTextInput from '../../../components/customTextInput/customTextInput';
import CustomButton from '../../../components/customButton';
import {AxiosError} from 'axios';
import {useDialog} from '../../../contexts/dialogContext';
import {PlataformEnum} from '../../../enum/platform.enum';
import {useAppNavigation} from '../../../hooks/useAppNavigation';
import {sendPasswordResetEmail} from '../../../services/auth';

export default function ForgotPasswordScreen() {
  const {showDialog, hideDialog} = useDialog();
  const {navigation} = useAppNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async ({email}: {email: string}) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(email);
      showDialog({
        title: 'E-mail de recuperação enviado!',
        description: 'Verifique sua caixa de entrada para recuperar sua senha.',
        confirm: {
          confirmLabel: 'Entendi',
          onConfirm: () => {
            hideDialog();
            navigation.goBack();
          },
        },
      });
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

  return (
    <View
      className={`bg-primary flex-1 ${Platform.OS === PlataformEnum.IOS ? 'px-5 py-20' : 'p-5'}`}>
      <Text className="text-dark text-center text-xl font-bold mb-4">
        Recuperar Senha
      </Text>
      <Text className="text-base text-dark text-center mb-5">
        Insira seu e-mail e enviaremos um link para redefinir sua senha.
      </Text>

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

      <CustomButton
        label="Enviar E-mail"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
    </View>
  );
}
