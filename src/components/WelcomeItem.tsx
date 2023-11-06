import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import useNavigation from '../hooks/useNavigation';

interface WelcomeItemParams {
  title: string;
  link?: string;
}

export default function WelcomeItem({title, link}: WelcomeItemParams) {
  const navigation = useNavigation();

  function handleNavigate(to?: string) {
    if (to) {
      navigation.navigate(to);
    }
  }

  return (
    <TouchableOpacity onPress={() => handleNavigate(link)}>
      <View style={styles.item}>
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#DDD',
    width: 150,
    height: 80,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
