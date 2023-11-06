import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '../components/Button';
import useNavigation from '../hooks/useNavigation';

// Tab: User
// Languages: 語言設定頁面
export default function Languages() {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  function handleLanguageChange(lang: 'zh' | 'en' | 'pt') {
    i18n.changeLanguage(lang);
    navigation.goBack();
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <View style={styles.wrapper}>
        <Button
          title={t('language.chinese')}
          onPress={() => handleLanguageChange('zh')}
        />
        <Button
          title={t('language.english')}
          onPress={() => handleLanguageChange('en')}
        />
        <Button
          title={t('language.portuguese')}
          onPress={() => handleLanguageChange('pt')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginBottom: 20,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
});
