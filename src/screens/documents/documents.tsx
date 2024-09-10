import {Icon, ListItem} from '@rneui/base';
import {useState} from 'react';
import {GestureResponderEvent, ScrollView, Text, View} from 'react-native';
import colors from '../../styles/colors';
import CustomButton from '../../components/customButton';
import styles from './style';

interface ListItemProps {
  title: string;
  description: string;
  completed: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

export default function DocumentsScreen() {
  const [stepsCompleted, setStepsCompleted] = useState({
    rg: true,
    selfie: false,
    residence: false,
    criminalRecord: false,
  });

  const allStepsCompleted =
    stepsCompleted.rg &&
    stepsCompleted.selfie &&
    stepsCompleted.residence &&
    stepsCompleted.criminalRecord;

  const renderItem = ({
    title,
    description,
    completed,
    onPress,
  }: ListItemProps) => (
    <ListItem bottomDivider onPress={onPress}>
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

  const handleDocument = () => {};
  const handleResidence = () => {};
  const handleCriminalRecord = () => {};
  const handleSelfie = () => {};

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
        completed: stepsCompleted.rg,
        onPress: handleDocument,
      })}

      {renderItem({
        title: 'Comprovante de residência',
        description: 'Tire uma foto do seu Comprovante de residência.',
        completed: stepsCompleted.residence,
        onPress: handleResidence,
      })}

      {renderItem({
        title: 'Certidão de Antecedentes Criminais',
        description: 'Tire uma foto do seu Certidão de Antecedentes Criminais.',
        completed: stepsCompleted.criminalRecord,
        onPress: handleCriminalRecord,
      })}

      {renderItem({
        title: 'Selfie',
        description: 'Tire uma selfie do seu rosto.',
        completed: stepsCompleted.selfie,
        onPress: handleSelfie,
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
