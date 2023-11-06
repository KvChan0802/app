import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import WebView from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import Share from 'react-native-share';
import {ShareIcon} from 'react-native-heroicons/outline';

import useNavigation from '../hooks/useNavigation';
import {RootStackParamList} from '../navigations/msc';
import {NewsType} from '../types';

type NewsContentScreenRouteProp = RouteProp<RootStackParamList, 'NewsContent'>;

interface NewsContentParams {
  route: NewsContentScreenRouteProp;
}

interface ShareButtonProps {
  tintColor: string | undefined;
  news: NewsType;
}

function ShareButton({tintColor, news}: ShareButtonProps) {
  function handleShare() {
    Share.open({
      title: news.title,
      url: news.link,
    }).catch(() => {});
  }

  return (
    <TouchableOpacity onPress={handleShare}>
      <ShareIcon color={tintColor} size={24} />
    </TouchableOpacity>
  );
}

// Tab: MSC
// NewsContent: 最新消息內容
export default function NewsContent({route}: NewsContentParams) {
  const navigation = useNavigation();
  const {news} = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: news.title,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: ({tintColor}) => (
        <ShareButton tintColor={tintColor} news={news} />
      ),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!news.link) {
    return null;
  }

  return <WebView source={{uri: news.link}} />;
}
