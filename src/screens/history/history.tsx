import {useState} from 'react';
import {ActivityIndicator, FlatList, Platform, Text, View} from 'react-native';
import {truncateText} from '../../utils/textUtils';
import styles from './styles';
import {walkByDogWalkers} from '../../services/walk';

export interface History {
  _id: string;
  ownerName: string;
  price: string;
  startDate: string;
}

const Header = () => (
  <View className="mb-5">
    <Text className="text-2xl	font-semibold text-dark">Histórico</Text>
  </View>
);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const renderHistory = ({item}: {item: History}) => (
  <View className="flex-row items-center justify-between py-2.5">
    <View className="flex-row">
      <View className="flex-col">
        <Text className="font-semibold text-base text-dark">
          {truncateText({
            text: item.ownerName || '',
            maxLength: 25,
          })}
        </Text>
        <Text className="text-accent text-xs">
          {formatDate(item.startDate)}
        </Text>
      </View>
    </View>

    <Text className="text-dark text-base font-semibold">R$ {item.price}</Text>
  </View>
);

const ItemSeparator = () => <View className="h-px bg-border" />;

const renderFooter = (isLoading: boolean) => {
  if (!isLoading) return null;
  return <ActivityIndicator size="large" color="#000" />;
};

const EmptyListMessage = () => (
  <View className="flex-1">
    <Text className="text-base text-dark">Você ainda não tem histórico.</Text>
  </View>
);

export default function History() {
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadHistory = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const {data} = await walkByDogWalkers(page);

      const {hasMore: more, results} = data;

      console.log('result data =>', {more, results});
      setHistory(prev => [...prev, ...results]);
      setHasMore(more);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.log('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View
      className={`flex-1 bg-primary ${Platform.OS === 'ios' ? 'px-5 py-20' : ' p-5'}`}>
      <FlatList
        data={history}
        renderItem={renderHistory}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Header />}
        onEndReached={loadHistory}
        onEndReachedThreshold={0.1}
        ItemSeparatorComponent={ItemSeparator}
        ListFooterComponent={renderFooter(isLoading)}
        ListEmptyComponent={<EmptyListMessage />}
      />
    </View>
  );
}
