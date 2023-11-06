import React, {Fragment, useEffect} from 'react';
import {
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import {useTranslation} from 'react-i18next';

import Loading from './Loading';
import NewsItem, {NewsItemSeparator} from '../components/NewsItem';
import {colors} from '../components/Styles';

import useInfo from '../hooks/useInfo';
import useNavigation from '../hooks/useNavigation';
import useNews from '../hooks/useNews';

import {RootStackParamList} from '../navigations/msc';
import {NewsType} from '../types';

type MSCScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface HomeParams {
  navigation: MSCScreenNavigationProp;
}

// Tab: MSC
// Home: 首頁
export default function Home({}: HomeParams) {
  const {t, i18n} = useTranslation();
  const {data: news, loading: loadingNews} = useNews(i18n.language);
  const {info, loading: loadingInfo} = useInfo(
    i18n.language !== 'zh' ? i18n.language : 'zh-Hant',
  );

  async function requestUserPermission() {
    await messaging().requestPermission();
  }

  function openMap(lat: number, lng: number, label: string) {
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url ?? '');
  }

  useEffect(() => {
    async function init() {
      await requestUserPermission();
    }

    init();
  }, []);

  if (loadingInfo || loadingNews) {
    return <Loading />;
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <SafeAreaView style={styles.scroll}>
        <Image
          source={require('../assets/images/msc_logo.png')}
          style={styles.logo}
          accessible
          accessibilityLabel={`${t('welcome-to-msc')}`}
        />
        <ScrollView>
          <Title title={t('news.title')} link="News" />
          {news?.slice(0, 5).map((item: NewsType, index: number) => (
            <Fragment key={index}>
              <NewsItem news={item} />
              {index < news.length - 1 && <NewsItemSeparator />}
            </Fragment>
          ))}

          <Title title={t('opening-hours.title')} />
          <View style={styles.contentContainer}>
            {info &&
              info.opening &&
              info.opening.map(day => (
                <View key={day.order} style={styles.openingItem} accessible>
                  <Text style={day.weekend ? styles.weekend : undefined}>
                    {day.day}
                  </Text>
                  <Text style={day.weekend ? styles.weekend : undefined}>
                    {t('opening-hours.monday-hours')}
                  </Text>
                </View>
              ))}
          </View>

          <Title title={t('visiting-guides.title')} />
          <View style={styles.contentContainer}>
            <Text style={styles.subTitle}>{t('visiting-guides.address')}</Text>
            <Text style={styles.paragraph}>{info?.location.address}</Text>
            {info?.access &&
              info?.access.map((item, index) => (
                <Fragment key={index}>
                  <Text style={styles.subTitle}>{item.method}</Text>
                  <Text style={styles.paragraph}>{item.description}</Text>
                </Fragment>
              ))}

            <TouchableOpacity
              onPress={() =>
                openMap(22.18605814887808, 113.55684238324649, t('msc.title'))
              }>
              <Image
                source={require('../assets/images/map.png')}
                style={styles.map}
                resizeMode="cover"
                accessible
                accessibilityLabel={`${t('welcome-to-msc')}`}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

interface TitleProps {
  title: string;
  link?: string;
}

function Title({title, link}: TitleProps) {
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {link && (
        <TouchableOpacity
          onPress={() => navigation.navigate(link)}
          accessibilityLabel={`${t('news.more-news')}`}> 
          <Text style={styles.more}>{t('news.more')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  logo: {
    width: '100%',
    height: 72,
    marginVertical: 16,
    resizeMode: 'contain',
  },
  scroll: {
    flexGrow: 1,
    flexShrink: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  title: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    lineHeight: 14 * 1.62,
  },
  more: {
    color: '#999',
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: 16,
  },
  openingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekend: {
    color: '#EE2E31',
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 16,
  },
});
