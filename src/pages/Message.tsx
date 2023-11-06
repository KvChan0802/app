import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';

import {RootStackParamList} from '../navigations';

type MessageScreenRouteProp = RouteProp<RootStackParamList, 'Message'>;

interface MessageParams {
  route: MessageScreenRouteProp;
}

// Tab: Explore
// Message: 公告內容
export default function Message({route}: MessageParams) {
  const {message} = route.params;

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{message.title}</Text>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView>
          <View style={styles.content}>
            <Text>{message.content}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  titleContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
  },
  contentContainer: {
    backgroundColor: '#FFF',
    borderColor: '#AAA',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexGrow: 1,
    flexShrink: 1,
  },
  content: {
    padding: 20,
  },
});
