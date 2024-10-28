import React, {useState} from 'react';
import {Switch, Text, View} from 'react-native';
import CustomTextInput from '../../../components/customTextInput/customTextInput';
import {useForm, Controller} from 'react-hook-form';
import CustomButton from '../../../components/customButton';
import {DogWalker, DogWalkerForm} from '../../../interfaces/dogWalker';
import {registerDogWalker} from '../../../services/dogWalkerService';
import {useDialog} from '../../../contexts/dialogContext';
import {AxiosError} from 'axios';
import {fetchAddress} from '../../../services/adress';
import {brazilStates} from '../../../utils/brazilStates';
import CustomPicker from '../../../components/customPicker/customPicker';
import {
  formatCEP,
  formatCPF,
  formatPhoneNumber,
  removeMask,
  removePhoneMask,
} from '../../../utils/textUtils';
import colors from '../../../styles/colors';

export default function SignUp({onRegister}: {onRegister: () => void}) {
  const [isLoading, setIsLoading] = useState(false);

  const {showDialog, hideDialog} = useDialog();

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      cpf: '',
      zipCode: '',
      street: '',
      houseNumber: '',
      neighborhood: '',
      city: '',
      state: '',
      password: '',
      confirmPassword: '',
      isAdult: false,
    },
  });

  const handleAddress = async (zipCode: string) => {
    const data = await fetchAddress(zipCode);
    const {logradouro, bairro, localidade, uf} = data;
    setValue('street', logradouro);
    setValue('neighborhood', bairro);
    setValue('city', localidade);
    setValue('state', uf);
  };

  const onSubmit = async (data: DogWalkerForm) => {
    if (!data.isAdult) {
      showDialog({
        title: 'Erro',
        confirm: {
          confirmLabel: 'Entendi',
          onConfirm: () => hideDialog(),
        },
        description: 'Você precisa ser maior de idade para usar a aplicação.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        confirmPassword,
        cpf,
        zipCode,
        street,
        houseNumber,
        neighborhood,
        city,
        state,
        phone,
        ...rest
      } = data;

      const document = removeMask(cpf);
      const cep = removeMask(zipCode);
      const rawPhone = removePhoneMask(phone);

      const dogWalker: DogWalker = {
        ...rest,
        document,
        phone: rawPhone,
        address: {
          zipCode: cep,
          street,
          houseNumber,
          neighborhood,
          city,
          state,
        },
      };
      6;
      await registerDogWalker(dogWalker);
      showDialog({
        title: 'Cadastro feito com sucesso!',
        confirm: {
          confirmLabel: 'Faça o login',
          onConfirm: () => {
            hideDialog();
            onRegister();
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
    <View>
      <View className="mb-3">
        <Controller
          control={control}
          name="name"
          rules={{required: 'Nome é obrigatório'}}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('name', text, {shouldValidate: true})
              }
              placeholder="Seu nome"
              error={errors.name?.message}
              isEditable={!isLoading}
            />
          )}
        />
      </View>
      <View className="mb-3">
        <Controller
          control={control}
          name="lastName"
          rules={{required: 'Sobrenome é obrigatório'}}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('lastName', text, {shouldValidate: true})
              }
              placeholder="Seu sobrenome"
              error={errors.lastName?.message}
              isEditable={!isLoading}
            />
          )}
        />
      </View>
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
              placeholder="Seu email"
              error={errors.email?.message}
              isEditable={!isLoading}
            />
          )}
        />
      </View>
      <View className="mb-3">
        <Controller
          control={control}
          name="phone"
          rules={{
            required: 'Telefone celular é obrigatório',
            pattern: {
              value: /^\+?\d{1,3}?\s?\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/,
              message: 'Telefone inválido. Use o formato: +55 (99) 99999-9999',
            },
          }}
          render={({field: {value}}) => (
            <CustomTextInput
              value={formatPhoneNumber(value)}
              onChangeText={(text: string) =>
                setValue('phone', text, {shouldValidate: true})
              }
              placeholder="Seu telefone celular com DDI (ex: +55)"
              error={errors.phone?.message}
              isEditable={!isLoading}
              keyboardType="phone-pad"
            />
          )}
        />
      </View>
      <View className="mb-3">
        <Controller
          control={control}
          name="cpf"
          rules={{
            required: 'CPF é obrigatório',
            pattern: {
              value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
              message: 'CPF inválido',
            },
          }}
          render={({field: {value}}) => (
            <CustomTextInput
              value={formatCPF(value)}
              onChangeText={(text: string) =>
                setValue('cpf', formatCPF(text), {shouldValidate: true})
              }
              placeholder="Seu CPF"
              error={errors.cpf?.message}
              isEditable={!isLoading}
              keyboardType="phone-pad"
            />
          )}
        />
      </View>
      <View className="mb-3">
        <Controller
          control={control}
          name="zipCode"
          rules={{
            required: 'CEP é obrigatório',
            pattern: {
              value: /^\d{5}-\d{3}$/,
              message: 'CEP inválido',
            },
          }}
          render={({field: {value}}) => (
            <CustomTextInput
              value={formatCEP(value)}
              onChangeText={(text: string) => {
                setValue('zipCode', formatCEP(text), {shouldValidate: true});
                if (text.length === 9) {
                  handleAddress(text);
                }
              }}
              placeholder="Seu CEP"
              error={errors.zipCode?.message}
              isEditable={!isLoading}
              keyboardType="phone-pad"
            />
          )}
        />
      </View>
      <View className="mb-3">
        <Controller
          control={control}
          name="street"
          rules={{required: 'Logradouro é obrigatório'}}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('street', text, {shouldValidate: true})
              }
              placeholder="Seu logradouro"
              error={errors.street?.message}
              isEditable={!isLoading}
            />
          )}
        />
      </View>
      <View className="mb-3">
        <Controller
          control={control}
          name="houseNumber"
          rules={{required: 'Número da casa é obrigatório'}}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('houseNumber', text, {shouldValidate: true})
              }
              placeholder="Número da casa"
              error={errors.houseNumber?.message}
              isEditable={!isLoading}
              keyboardType="numeric"
            />
          )}
        />
      </View>
      <View className="mb-3">
        <Controller
          control={control}
          name="neighborhood"
          rules={{required: 'Bairro é obrigatório'}}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('neighborhood', text, {shouldValidate: true})
              }
              placeholder="Seu bairro"
              error={errors.neighborhood?.message}
            />
          )}
        />
      </View>
      <View className="mb-3">
        <Controller
          control={control}
          name="city"
          rules={{required: 'Cidade é obrigatória'}}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('city', text, {shouldValidate: true})
              }
              placeholder="Sua cidade"
              error={errors.city?.message}
            />
          )}
        />
      </View>
      <View className="mb-3">
        <Controller
          control={control}
          name="state"
          rules={{required: 'Estado é obrigatório'}}
          render={({field: {value}}) => (
            <CustomPicker
              selectedValue={value}
              label="Selecione o estado"
              onValueChange={itemValue =>
                setValue('state', itemValue, {shouldValidate: true})
              }
              items={brazilStates}
              error={errors.state?.message}
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
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/,
              message:
                'A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial',
            },
          }}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('password', text, {shouldValidate: true})
              }
              placeholder="Sua senha"
              secureTextEntry={true}
              error={errors.password?.message}
              isEditable={!isLoading}
            />
          )}
        />
      </View>
      <View className="mb-3">
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Confirmação de senha é obrigatória',
            validate: value =>
              value === watch('password') || 'As senhas não coincidem',
          }}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('confirmPassword', text, {shouldValidate: true})
              }
              placeholder="Confirme sua senha"
              secureTextEntry={true}
              error={errors.confirmPassword?.message}
              isEditable={!isLoading}
            />
          )}
        />
      </View>

      <View className="mb-3">
        <Controller
          control={control}
          name="isAdult"
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <View className="flex-col items-start">
              <Text className="text-dark my-2">Você tem mais de 18 anos?</Text>
              <Switch
                trackColor={{false: '#E6E6E6', true: colors.green}}
                thumbColor={value ? colors.dark : colors.primary}
                value={value}
                onValueChange={onChange}
                disabled={isLoading}
              />
              {errors.isAdult && (
                <Text className="text-danger text-sm mt-1">
                  Você deve ser maior de idade para ser Dog Walker
                </Text>
              )}
            </View>
          )}
        />
      </View>

      <CustomButton
        label="Cadastrar"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
    </View>
  );
}
