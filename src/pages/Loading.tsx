import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

interface LoadingParams {}

// 有幾個頁面會用到
// - Explore
// - Home
// - MyMSC
// - Tickets
export default function Loading({}: LoadingParams) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <ActivityIndicator />
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});
