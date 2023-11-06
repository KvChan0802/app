import React, {useEffect} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import Styles from '../components/Styles';
import useNavigation from '../hooks/useNavigation';
import {RootStackParamList} from '../navigations/mymsc';

type ExhibitionScreenRouteProp = RouteProp<RootStackParamList, 'Work'>;

interface WorkParams {
  route: ExhibitionScreenRouteProp;
}

// Tab: MyMSC
// Work: 作品內容

// Tab: Explore
// Work: 作品內容

export default function Work({route}: WorkParams) {
  const navigation = useNavigation();
  const {exhibition, work} = route.params;

  const {getItem, setItem} = useAsyncStorage('@history');

  async function updateHistory() {
    const history = await getItem();
    const historyList = history ? JSON.parse(history) : [];
    const newHistoryList = historyList.filter((item: any) => item !== work);
    newHistoryList.unshift(work.id);
    await setItem(JSON.stringify(newHistoryList));
  }

  useEffect(() => {
    navigation.setOptions({title: work.name});
    updateHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView style={styles.container}>
      <View>
        <Image source={{uri: work.featureImage}} style={styles.image} />
      </View>
      <View style={styles.content} accessible>
        <Text style={Styles.title}>{work.name}</Text>
        <Text style={Styles.subtitle}>{exhibition.name}</Text>
        <Text style={Styles.paragraph}>{work.note}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    minHeight: '100%',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  content: {
    padding: 16,
  },
});
