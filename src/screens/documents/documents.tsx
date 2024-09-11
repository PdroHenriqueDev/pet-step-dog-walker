import {Icon, ListItem} from '@rneui/base';
import {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import colors from '../../styles/colors';
import CustomButton from '../../components/customButton';
import styles from './style';
import {useAppNavigation} from '../../hooks/useAppNavigation';

interface ListItemProps {
  title: string;
  description: string;
  documentType: string;
  completed: boolean;
}

export default function DocumentsScreen() {
  const {navigation} = useAppNavigation();
  const [stepsCompleted, setStepsCompleted] = useState({
    document: true,
    selfie: false,
    residence: false,
    criminalRecord: false,
  });

  const allStepsCompleted =
    stepsCompleted.document &&
    stepsCompleted.selfie &&
    stepsCompleted.residence &&
    stepsCompleted.criminalRecord;

  const goToPhotoScreen = (documentType: string) => {
    navigation.navigate('PhotoCapture', {documentType});
  };

  const renderItem = ({
    title,
    description,
    completed,
    documentType,
  }: ListItemProps) => (
    <ListItem bottomDivider onPress={() => goToPhotoScreen(documentType)}>
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

  return (
    <ScrollView className="bg-primary flex-1 p-5">
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
        description: 'Tire uma foto do seu Certidão de Antecedentes Criminais.',
        completed: stepsCompleted.criminalRecord,
        documentType: 'criminalRecord',
      })}

      {renderItem({
        title: 'Selfie',
        description: 'Tire uma selfie do seu rosto.',
        completed: stepsCompleted.selfie,
        documentType: 'selfie',
      })}

      <View className="justify-end mt-5" style={styles.buttonContainer}>
        <CustomButton
          label={'Prosseguir'}
          onPress={function (): void {
            throw new Error('Function not implemented.');
          }}
          disabled={!allStepsCompleted}
          backgroundColor={allStepsCompleted ? colors.accent : colors.secondary}
        />
        <Text className="text-center text-accent mt-5">
          Conclua todas as etapas para prosseguir
        </Text>
      </View>
    </ScrollView>
  );
}
