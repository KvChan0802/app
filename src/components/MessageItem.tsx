import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {MessageType} from '../types';
import useNavigation from '../hooks/useNavigation';

interface MessageItemParams {
  message: MessageType;
}

export default function MessageItem({message}: MessageItemParams) {
  const navigation = useNavigation();

  function handlePress() {
    navigation.navigate('Message', {message});
  }

  function formatDate() {
    const when = new Date(message.date);
    const mm = `0${when.getMonth() + 1}`.slice(-2);
    const dd = `0${when.getDay()}`.slice(-2);
    return `${mm}/${dd}`;
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={styles.image} />
        </View>

        <View style={styles.infoContainer}>
          <Text
            style={[
              styles.title,
              message.status === 'unread' ? styles.titleUnread : null,
            ]}>
            {message.status === 'unread' && '．'}
            {message.title}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {message.content}
          </Text>
          <Text style={styles.help} numberOfLines={1}>
            {formatDate()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function MessageItemSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  imageContainer: {},
  image: {
    backgroundColor: '#DDD',
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  infoContainer: {
    flexGrow: 1,
    flexShrink: 1,
    gap: 4,
  },
  title: {
    color: '#AAA',
    fontSize: 16,
  },
  titleUnread: {
    color: '#EA5455',
    fontWeight: 'bold',
  },
  description: {
    color: '#666',
  },
  help: {
    color: '#666',
    fontSize: 12,
  },
  separator: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});
