import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors} from './Styles';
import useNavigation from '../hooks/useNavigation';
import {NewsType} from '../types';

interface NewsItemParams {
  news: NewsType;
}

export default function NewsItem({news}: NewsItemParams) {
  const navigation = useNavigation();

  function handleNavigate() {
    if (news.link) {
      if (Platform.OS === 'ios') {
        Linking.openURL(news.link);
      } else {
        navigation.navigate('NewsContent', {news});
      }
    }
  }

  return (
    <TouchableOpacity onPress={handleNavigate}>
      <View style={styles.container}>
        <Text style={styles.title} numberOfLines={2}>
          {news.title}
        </Text>
        <View style={styles.infoContainer}>
          <Text style={styles.category} accessibilityLabel="">
            {news.category}
          </Text>
          <Text style={styles.date}>{news.updated_at}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function NewsItemSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    fontSize: 16,
    lineHeight: 16 * 1.3,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    backgroundColor: colors.emphersis,
    color: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  date: {
    color: '#666',
  },
  separator: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});
