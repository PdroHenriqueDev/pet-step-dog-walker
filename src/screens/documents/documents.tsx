import {Icon, ListItem} from '@rneui/base';
import {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import colors from '../../styles/colors';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {documentsStatus} from '../../services/application';
import {useDialog} from '../../contexts/dialogContext';
import {AxiosError} from 'axios';
import {DocumentType} from '../../types/document';
import Spinner from '../../components/spinner/spinner';
import CustomButton from '../../components/customButton';

interface ListItemProps {
  title: string;
  description: string;
  documentType: string;
  completed: boolean;
}

export default function DocumentsScreen() {
  const {navigation, route} = useAppNavigation();
  const {showDialog, hideDialog} = useDialog();
  const [stepsCompleted, setStepsCompleted] = useState({
    document: false,
    selfie: false,
    residence: false,
    criminalRecord: false,
    aboutMe: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const allStepsCompleted =
    stepsCompleted.document &&
    stepsCompleted.selfie &&
    stepsCompleted.residence &&
    stepsCompleted.criminalRecord &&
    stepsCompleted.aboutMe;

  const goToPhotoScreen = (documentType: string) => {
    if (documentType === 'aboutMe') return navigation.navigate('AboutMe');
    navigation.navigate('PhotoCapture', {documentType});
  };

  useEffect(() => {
    const getDocumentsStatus = async () => {
      try {
        const result = await documentsStatus();

        const {documentStatus, allDocumentsSent} = result;

        const {document, selfie, residence, criminalRecord, aboutMe} =
          documentStatus;

        setStepsCompleted({
          document,
          residence,
          criminalRecord,
          selfie,
          aboutMe,
        });

        if (allDocumentsSent) {
          navigation.navigate('ApplicationFeedback');
        }
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

    getDocumentsStatus();
  }, [hideDialog, navigation, showDialog]);

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const result = await documentsStatus();

      const {documentStatus, allDocumentsSent} = result;

      const {document, selfie, residence, criminalRecord, aboutMe} =
        documentStatus;

      setStepsCompleted({
        document,
        residence,
        criminalRecord,
        selfie,
        aboutMe,
      });

      if (allDocumentsSent) {
        navigation.navigate('ApplicationFeedback');
      }
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

  useEffect(() => {
    const params =
      (route.params as {
        success?: boolean;
        documentType?: DocumentType;
      }) ?? {};

    const {success = false, documentType = null} = params;
    if (success && documentType) {
      setStepsCompleted(prevState => ({
        ...prevState,
        [documentType]: true,
      }));
    }
  }, [allStepsCompleted, navigation, route.params]);

  const renderItem = ({
    title,
    description,
    completed,
    documentType,
  }: ListItemProps) => (
    <ListItem
      bottomDivider
      onPress={completed ? undefined : () => goToPhotoScreen(documentType)}>
      <ListItem.Content>
        <ListItem.Title>
          <Text className="text-base font-bold">{title}</Text>
        </ListItem.Title>
        <ListItem.Subtitle>
          <Text className="text-sm text-accent">{description}</Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      {completed ? (
        <Icon size={18} name="check" type="material" color={colors.secondary} />
      ) : (
        <ListItem.Chevron />
      )}
    </ListItem>
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <ScrollView className="flex-1 bg-primary p-5">
      <View className="items-center">
        <Text className="font-bold text-xl text-dark">Estamos quase lá!</Text>
        <Text className="text-base text-accent">
          Conclua as etapas abaixo para ser um Dog Walker
        </Text>
      </View>

      {renderItem({
        title: 'RG ou CNH',
        description: 'Tire uma foto dos seus documentos.',
        completed: stepsCompleted.document,
        documentType: 'document',
      })}

      {renderItem({
        title: 'Comprovante de residência',
        description: 'Tire uma foto do seu Comprovante de residência.',
        completed: stepsCompleted.residence,
        documentType: 'residence',
      })}

      {renderItem({
        title: 'Certidão Negativa de Antecedentes Criminais',
        description:
          'Tire uma foto da sua Certidão Negativa de Antecedentes Criminais.',
        completed: stepsCompleted.criminalRecord,
        documentType: 'criminalRecord',
      })}

      {renderItem({
        title: 'Selfie',
        description: 'Tire uma selfie do seu rosto.',
        completed: stepsCompleted.selfie,
        documentType: 'selfie',
      })}

      {renderItem({
        title: 'Sobre Mim',
        description:
          'Fale um pouco sobre suas experiências e por que deseja ser um Dog Walker no Pet Step.',
        completed: stepsCompleted.aboutMe,
        documentType: 'aboutMe',
      })}

      <View className="mt-5">
        <CustomButton
          label={'Prosseguir'}
          onPress={handleVerify}
          disabled={!allStepsCompleted}
          backgroundColor={
            !allStepsCompleted ? colors.accent : colors.secondary
          }
        />
        <Text className="text-center text-accent mt-2">
          Conclua todas as etapas para prosseguir
        </Text>
      </View>
    </ScrollView>
  );
}
