import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {WorkType as Work} from '../types';
import {colors} from './Styles';

interface Props {
  work: Work;
  index: number;
  onPress: () => void;
}

export default function ExploreWorkList({work, index, onPress}: Props) {
  return (
    <TouchableOpacity key={work?.id} onPress={onPress}>
      <View style={styles.container}>
        <View
          style={styles.workIconContainer}
          accessibilityLabel={`${work?.name}。距離你第${index + 1} 近。`}>
          <Image source={{uri: work?.featureImage}} style={styles.workIcon} />
        </View>

        <View style={styles.titles}>
          <Text style={styles.title} numberOfLines={2}>
            {work.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {work.exhibition?.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
  },
  workIconContainer: {
    backgroundColor: colors.background,
    width: 100,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: colors.emphersis,
    borderRadius: 999,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workIcon: {
    width: '90%',
    height: '90%',
    borderRadius: 999,
  },
  titles: {
    width: '100%',
    flexShrink: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    flexWrap: 'wrap',
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
  },
});
