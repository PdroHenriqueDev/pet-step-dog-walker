import {Text, View} from 'react-native';
import CustomButton from '../../../components/customButton';
import {useAuth} from '../../../contexts/authContext';
import {useDialog} from '../../../contexts/dialogContext';
import {useEffect, useState} from 'react';
import {DogWalkerApplicationStatus} from '../../../interfaces/dogWalkerApplicationStatus';

export default function ApplicationFeedbackScreen() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const {logout, user} = useAuth();
  const {showDialog, hideDialog} = useDialog();

  const handleLogOut = () => {
    showDialog({
      title: 'Tem certeza que quer sair?',
      confirm: {
        confirmLabel: 'Não',
        onConfirm: () => {
          hideDialog();
        },
      },
      cancel: {
        cancelLabel: 'Sim',
        onCancel: () => {
          logout();
          hideDialog();
        },
      },
    });
  };

  useEffect(() => {
    const statusMessages: {[key: string]: {title: string; message: string}} = {
      [DogWalkerApplicationStatus.PendingReview]: {
        title: 'Sua aplicação está sendo analisada',
        message:
          'Por favor, aguarde enquanto revisamos os seus documentos. Pode levar até 15 dias',
      },
      [DogWalkerApplicationStatus.Rejected]: {
        title: 'Sua aplicação foi rejeitada',
        message:
          'Infelizmente, sua aplicação não foi aprovada. Você pode tentar novamente.',
      },
      [DogWalkerApplicationStatus.Approved]: {
        title: 'Parabéns, sua aplicação foi aprovada',
        message:
          'Bem-vindo ao Pet Step como Dog Walker! Você já pode começar a aceitar passeios.',
      },
      default: {
        title: 'Aguardando processamento',
        message: 'Estamos verificando seus documentos. Pode levar até 30 dias.',
      },
    };

    const statusKey =
      user?.status && statusMessages[user.status] ? user.status : 'default';

    const {title: newTitle, message: newMessage} = statusMessages[statusKey];
    setTitle(newTitle);
    setMessage(newMessage);
  }, [user?.status]);

  return (
    <View className="flex-1 justify-center items-center bg-primary p-5">
      <Text className="text-dark text-xl font-bold">{title}</Text>
      <Text className="text-base text-accent text-center my-4">{message}</Text>

      <CustomButton label={'Sair'} onPress={handleLogOut} />
    </View>
  );
}
