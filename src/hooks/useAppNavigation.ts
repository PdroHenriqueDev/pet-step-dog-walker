import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import {DocumentType} from '../types/document';
import {FieldsUser} from '../interfaces/fieldsUser';

type RootStackParamList = {
  HomeScreen: undefined;
  PhotoCapture: {documentType: string};
  Documents: {documentType?: DocumentType; success?: boolean};
  AboutMe: undefined;
  ApplicationFeedback: undefined;
  Profile: undefined;
  WalkRequest: undefined;
  WalkInProgress: undefined;
  WalkMap: undefined;
  Chat: undefined;
  UpdateUserScreen: {field: FieldsUser};
  BankFlowScreen: undefined;
  BankScreen: undefined;
  BankUploadDocumentScreen: undefined;
  AccountScreen: undefined;
  UpdateProfileImgScreen: undefined;
};

type AppNavigationProp = NavigationProp<RootStackParamList>;
type AppRouteProp<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;

export const useAppNavigation = <
  RouteName extends keyof RootStackParamList,
>() => {
  const navigation = useNavigation<AppNavigationProp>();
  const route = useRoute<AppRouteProp<RouteName>>();

  return {navigation, route};
};
