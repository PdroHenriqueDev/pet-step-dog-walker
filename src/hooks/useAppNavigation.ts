import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import {DocumentType} from '../types/document';

type RootStackParamList = {
  HomeScreen: undefined;
  PhotoCapture: {documentType: string};
  Documents: {documentType?: DocumentType; success?: boolean};
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
