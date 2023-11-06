import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import NewsItem, {NewsItemSeparator} from '../components/NewsItem';
import useNews from '../hooks/useNews';
import {NewsType} from '../types';

interface NewsParams {}

// Tab: MSC
// News: 最新消息
export default function News({}: NewsParams) {
  const {i18n} = useTranslation();
  const {data: news, loading} = useNews(i18n.language);

  const renderItem: ListRenderItem<NewsType> = ({item}) => {
    return <NewsItem news={item} />;
  };

  if (loading) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={news}
      renderItem={renderItem}
      ItemSeparatorComponent={NewsItemSeparator}
    />
  );
}
