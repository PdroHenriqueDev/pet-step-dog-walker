import {FlatList, Platform, Text, View} from 'react-native';
import {truncateText} from '../../utils/textUtils';
import {useAuth} from '../../contexts/authContext';
import globalStyles from '../../styles/globalStyles';
import {Icon, ListItem} from '@rneui/base';
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
      value: user?.bank,
    },
    {
      id: '2',
      label: 'Nome',
      value: user?.name,
    },
    {
      id: '3',
      label: 'Sair',
      value: user?.name,
    },
  ];

  const handlePress = (field: FieldsUser) => {
    navigation.navigate('UpdateUserScreen', {field});
  };

  const handleLogout = () => {
    logout();
  };

  const renderItem = ({item}: {item: FieldsUser}) => (
    <>
      {item.label === 'Sair' ? (
        <View className="mt-5">
          <CustomButton
            label={item.label}
            onPress={handleLogout}
            backgroundColor={colors.danger}
            textColor={colors.primary}
          />
        </View>
      ) : (
        <ListItem bottomDivider onPress={() => handlePress(item)}>
          <ListItem.Content>
            <ListItem.Title>{item.label}</ListItem.Title>
          </ListItem.Content>
          <View className="flex-row items-center justify-between">
            <Text className="mr-2">
              {!item?.hide &&
                typeof item.value === 'string' &&
                (item?.value ?? 'vazio')}
            </Text>
            <ListItem.Chevron />
          </View>
        </ListItem>
      )}
    </>
  );

  return (
    <View
      className={`flex-1 bg-primary ${Platform.OS === 'ios' ? 'px-5 py-20' : 'p-5'}`}>
      <View className="flex-col items-center mb-5">
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
