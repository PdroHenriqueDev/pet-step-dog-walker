import React, {useEffect, useState} from 'react';
import {Platform, Text, View} from 'react-native';
import {useAppNavigation} from '../../../hooks/useAppNavigation';
import CustomButton from '../../../components/customButton';
import colors from '../../../styles/colors';
import {updateUser} from '../../../services/dogWalkerService';
import {AxiosError} from 'axios';
import {useDialog} from '../../../contexts/dialogContext';
import {FieldsUser} from '../../../interfaces/fieldsUser';
import {useAuth} from '../../../contexts/authContext';
import {Controller, useForm} from 'react-hook-form';
import CustomTextInput from '../../../components/customTextInput/customTextInput';
import {
  formatCEP,
  formatPhoneNumber,
  removeMask,
} from '../../../utils/textUtils';
import {fetchAddress} from '../../../services/adress';
import CustomPicker from '../../../components/customPicker/customPicker';
import {brazilStates} from '../../../utils/brazilStates';

export default function UpdateUser() {
  const {route, navigation} = useAppNavigation();
  const {field} = route.params as {field?: FieldsUser};
  const {showDialog, hideDialog} = useDialog();
  const {user, handleSetUser} = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {errors, isDirty},
  } = useForm({
    defaultValues: {
      value: field?.value || '',
      zipCode: formatCEP(user?.address?.zipCode) || '',
      street: user?.address?.street || '',
      houseNumber: user?.address?.houseNumber || '',
      neighborhood: user?.address?.neighborhood || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
    },
  });

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleSave = async (data: any) => {
    const {fieldType} = field ?? {};
    if (!fieldType) return;

    setIsLoading(true);
    try {
      let cleanedData;

      if (fieldType === 'phone') {
        cleanedData = removeMask(data.value) || '';
      } else if (fieldType === 'address') {
        cleanedData = {
          zipCode: removeMask(data.zipCode),
          street: data.street,
          houseNumber: data.houseNumber,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
        };
      } else {
        cleanedData = data.value;
      }

      await updateUser(fieldType, cleanedData);
      handleSetUser({
        ...user,
        [fieldType]: cleanedData,
      });
      navigation.goBack();
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError &&
        typeof error.response?.data?.data === 'string'
          ? error.response?.data?.data
          : 'Ocorreu um erro inesperado';
      showDialog({
        title: errorMessage,
        confirm: {
          confirmLabel: 'Entendi',
          onConfirm: () => {
            hideDialog();
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleAddress = async (zipCode: string) => {
    const data = await fetchAddress(zipCode);
    const {logradouro, bairro, localidade, uf} = data;
    setValue('street', logradouro);
    setValue('neighborhood', bairro);
    setValue('city', localidade);
    setValue('state', uf);
  };

  const renderField = () => {
    const {fieldType} = field ?? {};
    switch (fieldType) {
      case 'phone':
        return (
          <Controller
            control={control}
            name="value"
            rules={{
              required: 'Telefone celular é obrigatório',
              pattern: {
                value: /^\+?\d{1,3}?\s?\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/,
                message:
                  'Telefone inválido. Use o formato: +55 (99) 99999-9999',
              },
            }}
            render={({field: {value, onChange}}) => (
              <CustomTextInput
                value={formatPhoneNumber(value)}
                onChangeText={text => onChange(text)}
                placeholder="Seu telefone celular com DDI (ex: +55)"
                error={errors.value?.message}
                keyboardType="phone-pad"
                isEditable={!isLoading}
              />
            )}
          />
        );
      case 'email':
        return (
          <Controller
            control={control}
            name="value"
            rules={{
              required: 'Email é obrigatório',
              pattern: {value: /\S+@\S+\.\S+/, message: 'Email inválido'},
            }}
            render={({field: {value}}) => (
              <CustomTextInput
                value={value}
                onChangeText={(text: string) =>
                  setValue('value', text, {shouldValidate: true})
                }
                placeholder="Seu email"
                error={errors.value?.message}
                isEditable={!isLoading}
              />
            )}
          />
        );
      case 'address':
        return (
          <>
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
                    setValue('zipCode', formatCEP(text), {
                      shouldValidate: true,
                    });
                    if (text.length === 9) {
                      handleAddress(text);
                    }
                  }}
                  placeholder="CEP"
                  error={errors.zipCode?.message}
                  keyboardType="numeric"
                  isEditable={!isLoading}
                />
              )}
            />
            <View className="mt-3">
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
            <View className="mt-3">
              <Controller
                control={control}
                name="houseNumber"
                rules={{required: 'Número é obrigatório'}}
                render={({field: {value}}) => (
                  <CustomTextInput
                    value={value}
                    onChangeText={(text: string) =>
                      setValue('houseNumber', text, {shouldValidate: true})
                    }
                    placeholder="Número"
                    error={errors.houseNumber?.message}
                    isEditable={!isLoading}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
            <View className="mt-3">
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
            <View className="mt-3">
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
            <View className="mt-3">
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
          </>
        );
      default:
        return (
          <Controller
            control={control}
            name="value"
            rules={{required: `${field?.label} é obrigatório`}}
            render={({field: {value, onChange}}) => (
              <CustomTextInput
                value={value}
                onChangeText={text => onChange(text)}
                placeholder={`Digite seu ${field?.label.toLowerCase()}`}
                error={errors.value?.message}
                isEditable={!isLoading}
              />
            )}
          />
        );
    }
  };

  return (
    <View
      className={`flex-1 items-center bg-primary ${Platform.OS === 'ios' ? 'px-5 py-20' : 'p-5'}`}>
      <Text className="text-dark text-2xl font-bold">{field?.label}</Text>
      <View className="w-full my-5">{renderField()}</View>
      <CustomButton
        label={'Atualizar'}
        onPress={handleSubmit(handleSave)}
        disabled={isLoading || (!isDirty && field?.fieldType !== 'address')}
        isLoading={isLoading}
        backgroundColor={
          !isDirty && field?.fieldType !== 'address'
            ? colors.accent
            : colors.secondary
        }
      />

      <CustomButton
        label={'Cancelar'}
        backgroundColor={colors.primary}
        textColor={colors.dark}
        onPress={handleCancel}
        disabled={isLoading}
      />
    </View>
  );
}
