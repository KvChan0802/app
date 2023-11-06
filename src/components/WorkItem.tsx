import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {ExhibitionType, WorkType} from '../types';
import useNavigation from '../hooks/useNavigation';

interface WorkItemParams {
  exhibition: ExhibitionType;
  work: WorkType;
  available: boolean;
}

export default function WorkItem({
  exhibition,
  work,
  available = true,
}: WorkItemParams) {
  const navigation = useNavigation();

  function handlePress() {
    if (available) {
      navigation.navigate('Work', {exhibition, work});
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: exhibition.name,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{uri: work.featureImage}} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.title, !available && styles.unavailableTitle]}>
            {work.name}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {work.note}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function WorkItemSeparator() {
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
    // backgroundColor: '#DDD',
    resizeMode: 'cover',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  unavailableTitle: {
    color: '#AAA',
  },
  description: {
    color: '#666',
  },
  separator: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});
