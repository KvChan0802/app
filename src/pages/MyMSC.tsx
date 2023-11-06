import React from 'react';
import {FlatList, ListRenderItem, View} from 'react-native';

import {ExhibitionType} from '../types';
import Loading from './Loading';
import ExhibitionItem from '../components/ExhibitionItem';

import useFetchExhibition from '../hooks/useFetchExhibition';
import { Text } from 'react-native-svg';

// Tab: MyMSC
// MyMSC: 展廳列表 
export default function MyMSC() {
  const {data: exhibitions, status} = useFetchExhibition();
  
  const renderItem: ListRenderItem<ExhibitionType> = ({item}) => {
    return <ExhibitionItem exhibition={item} />;
  };

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <FlatList
      data={exhibitions
        .filter((e: ExhibitionType) => e.visible)
        .sort((a: ExhibitionType, b: ExhibitionType) =>
          a.code < b.code ? 1 : -1,
        )}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      inverted
    />
  );
}

