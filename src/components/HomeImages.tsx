import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

interface HomeImagesParams {}

export default function HomeImages({}: HomeImagesParams) {
  return (
    <View>
      <Image source={{uri: 'https://imgur.com/WSjvkM8'}} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 1000 / 350,
  },
});
