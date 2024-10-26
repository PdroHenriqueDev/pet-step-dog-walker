import {Platform, Text, View} from 'react-native';
import {ListItem} from '@rneui/base';
import {PlataformEnum} from '../../../enum/platform.enum';
import {useAuth} from '../../../contexts/authContext';
import {useAppNavigation} from '../../../hooks/useAppNavigation';
import {useEffect, useState} from 'react';
import {
  accountCheckStatus,
  accountPendingItems,
} from '../../../services/dogWalkerService';
import {useDialog} from '../../../contexts/dialogContext';
import {AxiosError} from 'axios';

export default function BankFlowScreen() {
  const {showDialog, hideDialog} = useDialog();
  const {user} = useAuth();
  const {navigation} = useAppNavigation();

  const [pendingRequirements, setPendingRequirements] = useState([]);
  const [documentStatus, setDocumentStatus] = useState('');

  const handlePress = (commant: 'document' | 'account') => {
    commant === 'document'
      ? navigation.navigate('BankUploadDocumentScreen')
      : navigation.navigate('BankScreen');
  };

  useEffect(() => {
    const getRequirements = async () => {
      try {
        const result = await accountPendingItems();
        setPendingRequirements(result);
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
      }
    };

    getRequirements();
  }, [hideDialog, showDialog]);

  useEffect(() => {
    const accountStatus = async () => {
      try {
        const status = await accountCheckStatus();
        setDocumentStatus(status);
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
      }
    };

    accountStatus();
  }, [hideDialog, showDialog]);

  return (
    <View
      className={`flex-1 bg-primary ${Platform.OS === PlataformEnum.IOS ? 'px-5 py-20' : 'p-5'}`}>
      <Text className="text-dark text-center mb-5 text-2xl font-bold">
        Dados bancários
      </Text>

      {pendingRequirements.length > 0 &&
        pendingRequirements.map((requirement, index) => (
          <View key={index} className="flex-row items-center my-1">
            <Text className="text-danger font-bold">• {requirement}</Text>
          </View>
        ))}

      <ListItem bottomDivider onPress={() => handlePress('account')}>
        <ListItem.Content>
          <ListItem.Title>Conta</ListItem.Title>
        </ListItem.Content>
        <View className="flex-row items-center justify-between">
          <Text className="mr-2 text-dark font-bold">
            {user?.bank?.bankCode &&
            user?.bank?.agencyNumber &&
            user?.bank?.accountNumber
              ? `${user.bank.bankCode}-${user.bank.agencyNumber}/${user.bank.accountNumber}`
              : 'Nenhuma conta vinculada'}
          </Text>
          <ListItem.Chevron />
        </View>
      </ListItem>

      {user?.bank && !user.bank.bankDocumentVerified && (
        <ListItem bottomDivider onPress={() => handlePress('document')}>
          <ListItem.Content>
            <ListItem.Title>Documento</ListItem.Title>
          </ListItem.Content>
          <View className="flex-row items-center justify-between">
            {/* <Text className="mr-2 text-dark font-bold">{documentStatus}</Text> */}
            <Text
              className={`mr-2 ${documentStatus === 'Verificado com sucesso' ? 'text-green' : 'text-danger'}  font-bold`}>
              {documentStatus}
            </Text>
            <ListItem.Chevron />
          </View>
        </ListItem>
      )}
    </View>
  );
}
