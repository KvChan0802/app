import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';

interface MenuWrapperParams {
  children: ReactNode;
}

export default function MenuWrapper({children}: MenuWrapperParams) {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    right: 40,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
});
