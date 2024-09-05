import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import CustomTextInput from '../../../components/customTextInput/customTextInput';
import {useForm, Controller} from 'react-hook-form';
import CustomButton from '../../../components/customButton';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      birthdate: '',
      password: '',
      confirmPassword: '',
    },
  });

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

  const onSubmit = (data: any) => {
    console.log(data);
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
          name="surname"
          rules={{required: 'Sobrenome é obrigatório'}}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('surname', text, {shouldValidate: true})
              }
              placeholder="Seu sobrenome"
              error={errors.surname?.message}
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
