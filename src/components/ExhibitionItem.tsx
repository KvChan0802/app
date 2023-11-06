import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Styles, {colors} from './Styles';
import {ExhibitionType} from '../types';
import useNavigation from '../hooks/useNavigation';

// k-test-start
import BeaconContext from '../context/BeaconContext';
import {useTranslation} from 'react-i18next';
import {useContext} from 'react';
import {WorkType} from '../types';
import useWork from '../hooks/useWork';
import useFetchExhibition from '../hooks/useFetchExhibition';
// k-test-end

interface ExhibitionItemParams {
  exhibition: ExhibitionType;
}

export default function ExhibitionItem({exhibition}: ExhibitionItemParams) {
  const navigation = useNavigation();

  function handlePress() {
    navigation.navigate('Exhibition', {exhibition});
  }

  // k-test-start
  const {t, i18n} = useTranslation();
  const {language} = i18n;
  const {beacons} = useContext(BeaconContext);
  const {data: exhibitions, status} = useFetchExhibition();
  const works = useWork(beacons, exhibitions);

  const data = exhibition.products
    ?.filter((work: WorkType) => work.visible)
    .map(work => {
      return work.id
    }) as [];
  // k-test-end

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{uri: exhibition.featureImage}} />
        </View>
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0)',
            'rgba(0, 0, 0, 0.6)',
            'rgba(0, 0, 0, 0.8)',
          ]}
          locations={[0, 0.5, 1]}
          style={styles.infoContainer}>
          {works.length > 0 && (data.some(i => i == works[works.length-1].id) && 
            <Image 
              style={[styles.hereIcon]} 
              source={require('../assets/images/here.png')} 
              accessible
              accessibilityLabel={`${t('maphere')}`}
            />)}
          <Text
            style={[Styles.title, styles.title]}
            accessibilityLabel={`${exhibition.name}`}>
            {exhibition.code} - {exhibition.name}
          </Text>
          <Text
            style={[Styles.paragraph, styles.description]}
            numberOfLines={2}>
            {exhibition.note}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

export function ExhibitionItemSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    aspectRatio: 16 / 9,
  },
  image: {
    backgroundColor: '#DDD',
    width: '100%',
    aspectRatio: 16 / 9,
    resizeMode: 'cover',
  },
  hereIcon: {
    width:80,
    height:80,
    alignSelf:'flex-end'
  },
  infoContainer: {
    position: 'absolute',
    width: '100%',
    padding: 20,
    paddingTop: 40,
    flexGrow: 1,
    flexShrink: 1,
    gap: 4,
  },
  title: {
    color: colors.white,
    marginBottom: 0,
  },
  description: {
    color: '#DDD',
  },
  separator: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});
