import {FlatList, Platform, Text, View} from 'react-native';
import {formatPhoneNumber, truncateText} from '../../utils/textUtils';
import {useAuth} from '../../contexts/authContext';
import globalStyles from '../../styles/globalStyles';
import {Avatar, Icon, ListItem} from '@rneui/base';
import colors from '../../styles/colors';
import {FieldsUser} from '../../interfaces/fieldsUser';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import CustomButton from '../../components/customButton';

export default function Account() {
  const {user, logout} = useAuth();
  const {navigation} = useAppNavigation();

  const fields: FieldsUser[] = [
    {
      id: '1',
      label: 'Conta Bancária',
      value: '',
      fieldType: 'bank',
    },
    {
      id: '2',
      label: 'Nome',
      value: user?.name,
      fieldType: 'name',
    },
    {
      id: '3',
      label: 'Sobrenome',
      value: user?.lastName,
      fieldType: 'lastName',
    },
    {
      id: '5',
      label: 'Celular',
      value: user?.phone,
      displayNmae: formatPhoneNumber(user?.phone),
      fieldType: 'phone',
    },
    {
      id: '6',
      label: 'Endereço',
      value: user?.address?.street,
      fieldType: 'address',
    },
    {
      id: '7',
      label: 'Sair',
    },
    {
      id: '8',
      label: 'Desativar conta',
    },
  ];

  const handlePress = (field: FieldsUser) => {
    field.fieldType === 'bank'
      ? navigation.navigate('BankFlowScreen')
      : navigation.navigate('UpdateUserScreen', {field});
  };

  const handleLogout = () => {
    logout();
  };

  const navigateToImageSelector = () => {
    navigation.navigate('UpdateProfileImgScreen');
  };

  const handleDeactivateAccount = () => {};

  const renderItem = ({item}: {item: FieldsUser}) => {
    const renderButton = ({
      label,
      onPress,
      backgroundColor = colors.danger,
      textColor = colors.primary,
    }: {
      label: string;
      onPress: () => void;
      backgroundColor?: string;
      textColor?: string;
    }) => (
      <View className="mt-5">
        <CustomButton
          label={label}
          onPress={onPress}
          backgroundColor={backgroundColor}
          textColor={textColor}
        />
      </View>
    );

    if (item.label === 'Sair') {
      return renderButton({label: item.label, onPress: handleLogout});
    }

    if (item.label === 'Desativar conta') {
      return renderButton({
        label: item.label,
        onPress: handleDeactivateAccount,
        backgroundColor: colors.primary,
        textColor: colors.dark,
      });
    }

    return (
      <ListItem bottomDivider onPress={() => handlePress(item)}>
        <ListItem.Content>
          <ListItem.Title>{item.label}</ListItem.Title>
        </ListItem.Content>
        <View className="flex-row items-center justify-between">
          <Text className="mr-2">
            {!item?.hide && typeof item.value === 'string'
              ? (item?.displayNmae ?? item.value)
              : 'vazio'}
          </Text>
          <ListItem.Chevron />
        </View>
      </ListItem>
    );
  };

  return (
    <View
      className={`flex-1 bg-primary ${Platform.OS === 'ios' ? 'px-5 py-20' : 'p-5'}`}>
      <View className="flex-col items-center mb-5">
        <Avatar
          rounded
          size={'large'}
          onPress={navigateToImageSelector}
          source={{
            uri:
              user?.profileUrl ||
              'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          }}
        />

        <Text className="text-dark text-2xl font-bold">
          {truncateText({
            text: user?.name || '',
            maxLength: 25,
          })}
        </Text>

        <View className="w-20 flex-row items-center justify-between border border-border rounded-2xl p-2.5">
          <Icon type="feather" name="star" size={16} color={colors.dark} />
          <Text style={globalStyles.label}>{user?.rate}</Text>
        </View>
      </View>
      <FlatList
        data={fields}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        className="mb-10"
      />
    </View>
  );
}
