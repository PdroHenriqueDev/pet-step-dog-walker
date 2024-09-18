import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import CustomTextInput from '../../../components/customTextInput/customTextInput';
import {useForm, Controller} from 'react-hook-form';
import CustomButton from '../../../components/customButton';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {DogWalker, DogWalkerForm} from '../../../interfaces/dogWalker';
import {registerDogWalker} from '../../../services/dogWalkerService';
import {useDialog} from '../../../contexts/dialogContext';
import {AxiosError} from 'axios';
import {fetchAddress} from '../../../services/adress';
import {brazilStates} from '../../../utils/brazilStates';
import CustomPicker from '../../../components/customPicker/customPicker';

export default function SignUp({onRegister}: {onRegister: () => void}) {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      neighborhood: '',
      city: '',
      state: '',
      birthdate: '',
      password: '',
      confirmPassword: '',
    },
  });

  const formatPhoneNumber = (phone: string) => {
    return phone
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d{2})(\d)/g, '+$1 ($2) $3')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const isAdult = (birthdate: string | number | Date) => {
    const today = new Date();
    const birthDate = new Date(birthdate);

    const adultMinimumDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );

    return birthDate <= adultMinimumDate;
  };

  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined,
  ) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setValue('birthdate', currentDate.toISOString().split('T')[0], {
      shouldValidate: true,
    });
  };

  const formatCPF = (cpf: string) => {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const removeMask = (value?: string) => {
    if (!value) return;
    return value.replace(/\D/g, '');
  };

  const removePhoneMask = (phone?: string) => {
    if (!phone) return;
    return phone.replace(/[^\d+]/g, '');
  };

  const formatCEP = (cep: string) => {
    return cep
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleAddress = async (zipCode: string) => {
    const data = await fetchAddress(zipCode);
    const {logradouro, bairro, localidade, uf} = data;
    setValue('street', logradouro);
    setValue('neighborhood', bairro);
    setValue('city', localidade);
    setValue('state', uf);
  };

  const onSubmit = async (data: DogWalkerForm) => {
    console.log('got here', data);
    setIsLoading(true);
    try {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        confirmPassword,
        cpf,
        zipCode,
        street,
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
        const message = error.response?.data || 'Ocorreu um erro inesperado';
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
          name="birthdate"
          rules={{
            required: 'Data de nascimento é obrigatória',
            validate: value =>
              isAdult(value) || 'Você deve ter mais de 18 anos',
          }}
          render={({field: {value}}) => (
            <TouchableOpacity
              onPress={isLoading ? undefined : () => setShowDatePicker(true)}
              disabled={isLoading}>
              <CustomTextInput
                value={value ? new Date(value).toLocaleDateString() : ''}
                placeholder="Data de nascimento"
                error={errors.birthdate?.message}
                isEditable={false}
              />
            </TouchableOpacity>
          )}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
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
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
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

      <CustomButton
        label="Cadastrar"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
    </View>
  );
}
