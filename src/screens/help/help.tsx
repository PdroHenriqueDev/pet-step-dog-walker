import {Platform, Text, View, Linking, Alert} from 'react-native';
import CustomButton from '../../components/customButton';
import {useDialog} from '../../contexts/dialogContext';
import Clipboard from '@react-native-clipboard/clipboard';

export default function HelpScreen() {
  const {showDialog, hideDialog} = useDialog();

  const handleContactSupport = () => {
    const supportEmail = 'petstep.servico@gmail.com';
    const subject = 'Ajuda com o App Pet Step';
    const emailUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}`;

    Linking.openURL(emailUrl).catch(error => {
      console.log('Não foi possível abrir o cliente de e-mail', error);
      showDialog({
        title: 'Não foi possível abrir o cliente de e-mail',
        description: `Por favor, envie um e-mail manualmente para: ${supportEmail}`,
        confirm: {
          confirmLabel: 'Copiar e-mail',
          onConfirm: () => {
            Clipboard.setString(supportEmail);
            hideDialog();
            Alert.alert(
              'E-mail copiado',
              'O e-mail de suporte foi copiado para sua área de transferência.',
            );
          },
        },
        cancel: {
          cancelLabel: 'Fechar',
          onCancel: () => {
            hideDialog();
          },
        },
      });
    });
  };

  return (
    <View
      className={`flex-1 bg-primary ${Platform.OS === 'ios' ? 'px-5 py-20' : 'p-5'}`}>
      <Text className="text-lg font-bold text-center mb-5">
        Ajuda e Suporte
      </Text>
      <Text className="text-base text-center mb-10">
        Caso esteja enfrentando problemas com o aplicativo, entre em contato com
        o nosso time de suporte.
      </Text>
      <CustomButton
        label={' Enviar E-mail para Suporte'}
        onPress={handleContactSupport}
      />
    </View>
  );
}
