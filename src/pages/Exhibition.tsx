import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import {RootStackParamList} from '../navigations/mymsc';
import WorkItem, {WorkItemSeparator} from '../components/WorkItem';
import useNavigation from '../hooks/useNavigation';
import {ExhibitionType, WorkType} from '../types';
import Styles from '../components/Styles';

type ExhibitionScreenRouteProp = RouteProp<RootStackParamList, 'Exhibition'>;

interface ExhibitionParams {
  route: ExhibitionScreenRouteProp;
}

// Tab: MyMSC
// Exhibition: 展廳內容-作品列表 
export default function Exhibition({route}: ExhibitionParams) {
  const navigation = useNavigation();
  const {exhibition} = route.params;

  const {getItem} = useAsyncStorage('@history');
  const [history, setHistory] = React.useState<string[]>([]);

  const renderItem: ListRenderItem<any> = ({item}) => {
    if (item.type === 'image') {
      return <HeroImage exhibition={item.data} />;
    }

    if (item.type === 'description') {
      return <Description exhibition={item.data} />;
    }

    return (
      <WorkItem
        work={item.data}
        exhibition={exhibition}
        available={history.some(record => record === item.data.id)}
      />
    );
  };

  function itemSeparator(item: any) {
    if (item.leadingItem.type === 'work') {
      return <WorkItemSeparator />;
    }

    return null;
  }

  async function readHistory() {
    const items = await getItem();
    setHistory(items ? JSON.parse(items) : []);
  }

  useEffect(() => {
    navigation.setOptions({title: exhibition.name});
    readHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const data = exhibition.products
    ?.filter((work: WorkType) => work.visible)
    .map(work => ({
      type: 'work',
      data: work,
    })) as [];

  return (
    <FlatList
      data={[
        {type: 'image', data: exhibition},
        {type: 'description', data: exhibition},
        ...(data ?? []),
      ]}
      renderItem={renderItem}
      ItemSeparatorComponent={itemSeparator}
    />
  );
}

interface HeroImageParams {
  exhibition: ExhibitionType;
}

function HeroImage({exhibition}: HeroImageParams) {
  return (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{uri: exhibition.featureImage}} />
    </View>
  );
}

interface DescriptionParams {
  exhibition: ExhibitionType;
}

function Description({exhibition}: DescriptionParams) {
  return (
    <View style={styles.description}>
      <Text style={Styles.paragraph}>
        {exhibition.note?.replace(/(\n*)$/, '')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  image: {
    backgroundColor: '#DDD',
    width: '100%',
    height: '100%',
  },
  description: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 20,
  },
});
