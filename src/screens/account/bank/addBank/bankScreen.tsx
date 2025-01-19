import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {PlataformEnum} from '../../../../enum/platform.enum';
import {useDialog} from '../../../../contexts/dialogContext';
import {Controller, useForm} from 'react-hook-form';
import CustomButton from '../../../../components/customButton';
import CustomTextInput from '../../../../components/customTextInput/customTextInput';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {useEffect, useState} from 'react';
import colors from '../../../../styles/colors';
import globalStyles from '../../../../styles/globalStyles';
import {addAccount} from '../../../../services/dogWalkerService';
import {AxiosError} from 'axios';
import {isAdult} from '../../../../utils/textUtils';
import CustomPicker from '../../../../components/customPicker/customPicker';
import {ScrollView} from 'react-native-gesture-handler';
import {useAuth} from '../../../../contexts/authContext';
import {useAppNavigation} from '../../../../hooks/useAppNavigation';
import {listBanks} from '../../../../services/staticDataService';

export default function BankScreen() {
  const {user, handleSetUser} = useAuth();
  const {navigation} = useAppNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const {showDialog, hideDialog} = useDialog();
  const [date, setDate] = useState(
    user?.birthdate
      ? new Date(
          user.birthdate.year,
          user.birthdate.month - 1,
          user.birthdate.day,
        )
      : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [banks, setBanks] = useState<{label: string; value: string}[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      bankCode: user?.bank?.bankCode ?? '',
      agencyNumber: user?.bank?.agencyNumber ?? '',
      accountNumber: user?.bank?.accountNumber ?? '',
      birthdate: user?.birthdate
        ? new Date(
            user.birthdate.year,
            user.birthdate.month - 1,
            user.birthdate.day,
          )
        : new Date(),
    },
  });

  useEffect(() => {
    const loadBanks = async () => {
      setIsLoading(true);
      try {
        const response = await listBanks();
        setBanks(response);
      } catch (error) {
        showDialog({
          title: 'Erro ao carregar bancos',
          confirm: {
            confirmLabel: 'Entendi',
            onConfirm: hideDialog,
          },
          description:
            error instanceof AxiosError
              ? error.response?.data?.data ||
                'Erro inesperado ao carregar bancos'
              : 'Erro inesperado ao carregar bancos',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBanks();
  }, [hideDialog, showDialog]);

  const onSubmit = (data: any) => {
    const birthdate = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };

    showDialog({
      title: 'Confirmação de Adição de Banco',
      description:
        'Você revisou todas as informações do banco e confirma que estão corretas?',
      confirm: {
        confirmLabel: 'Sim, confirmar',
        onConfirm: async () => {
          hideDialog();
          await saveAccount({
            bankCode: data.bankCode,
            agencyNumber: data.agencyNumber,
            accountNumber: data.accountNumber,
            birthdate,
          });
        },
      },
      cancel: {
        cancelLabel: 'Cancelar',
        onCancel: () => {
          hideDialog();
        },
      },
    });
  };

  const saveAccount = async ({
    bankCode,
    accountNumber,
    agencyNumber,
    birthdate,
  }: {
    bankCode: string;
    agencyNumber: string;
    accountNumber: string;
    birthdate: {day: number; month: number; year: number};
  }) => {
    setIsLoading(true);
    try {
      await addAccount({bankCode, accountNumber, agencyNumber, birthdate});

      handleSetUser({
        ...user,
        bank: {
          bankCode,
          accountNumber,
          agencyNumber,
        },
        birthdate,
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

  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined,
  ) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setValue('birthdate', currentDate, {
      shouldValidate: true,
    });
  };

  const handleDatePicker = () => {
    if (isLoading && Platform.OS !== 'android') return;
    setShowDatePicker(true);
  };

  const formatDateForDisplay = (value: Date) => {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <ScrollView
      className={`flex-1 bg-primary ${Platform.OS === PlataformEnum.IOS ? 'px-5 pt-20' : ' p-4'}`}>
      <Text className="text-2xl font-bold text-center mb-6 text-dark">
        Adicionar Banco
      </Text>

      <View className="mb-3">
        <Controller
          control={control}
          name="bankCode"
          rules={{required: 'Código do banco é obrigatório'}}
          render={({field: {value}}) => (
            <CustomPicker
              selectedValue={value}
              onValueChange={itemValue =>
                setValue('bankCode', itemValue, {shouldValidate: true})
              }
              items={banks}
              label="Selecione o banco"
              error={errors.bankCode?.message}
            />
          )}
        />
      </View>

      <View className="mb-3">
        <Controller
          control={control}
          name="agencyNumber"
          rules={{
            required: 'Número da agência é obrigatório',
          }}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('agencyNumber', text, {shouldValidate: true})
              }
              placeholder="Número da Agência"
              keyboardType="numeric"
              error={errors.agencyNumber?.message}
              isEditable={!isLoading}
            />
          )}
        />
      </View>

      <View className="mb-3">
        <Controller
          control={control}
          name="accountNumber"
          rules={{
            required: 'Número da conta é obrigatório',
          }}
          render={({field: {value}}) => (
            <CustomTextInput
              value={value}
              onChangeText={(text: string) =>
                setValue('accountNumber', text, {shouldValidate: true})
              }
              placeholder="Número da Conta"
              keyboardType="numeric"
              error={errors.accountNumber?.message}
              isEditable={!isLoading}
            />
          )}
        />
      </View>

      {Platform.OS === PlataformEnum.IOS && (
        <View className="mb-3">
          <Text className="text-dark text-base">Data de nascimento</Text>
        </View>
      )}

      <View className="mb-3">
        <Controller
          control={control}
          name="birthdate"
          rules={{
            required: 'Data de nascimento é obrigatória',
            validate: value =>
              isAdult(value) || 'Você deve ter mais de 18 anos',
          }}
          render={() => (
            <>
              {Platform.OS === 'ios' ? (
                <>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                    textColor={colors.dark}
                    accentColor={colors.dark}
                    style={globalStyles.datePickerIos}
                  />
                  <Text className="text-danger text-sm mt-1">
                    {errors.birthdate?.message}
                  </Text>
                </>
              ) : (
                <TouchableOpacity
                  onPress={handleDatePicker}
                  disabled={isLoading}>
                  <CustomTextInput
                    value={formatDateForDisplay(date)}
                    placeholder="Data de nascimento"
                    error={errors.birthdate?.message}
                    isEditable={false}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        />

        {Platform.OS !== 'ios' && showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                onDateChange(event, selectedDate);
              }
            }}
            maximumDate={new Date()}
          />
        )}
      </View>

      <View className="mb-80">
        <CustomButton
          label="Salvar Banco"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
      </View>
    </ScrollView>
  );
}
