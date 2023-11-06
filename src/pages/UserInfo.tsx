import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {UserIcon} from 'react-native-heroicons/outline';
import {useTranslation} from 'react-i18next';

import Styles from '../components/Styles';

import useAuth from '../hooks/useAuth';
import useFacebookLogin from '../hooks/useFacebookLogin';
import useGoogleLogin from '../hooks/useGoogleLogin';
import useNavigation from '../hooks/useNavigation';

interface UserInfoParams {}

// Tab: User
// UserInfo: 帳戶頁面
export default function UserInfo({}: UserInfoParams) {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  const {user, name, profilePic, logout} = useAuth();
  const {login: loginGoogle} = useGoogleLogin();
  const {login: loginFacebook} = useFacebookLogin();

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <View style={styles.titleContainer}>
        <View style={styles.avatar}>
          {profilePic !== null ? (
            <Image source={{uri: profilePic}} style={styles.avatarImage} />
          ) : (
            <UserIcon color="#000" />
          )}
        </View>
        <Text style={[Styles.title, styles.title]}>{name}</Text>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView>

          <View style={styles.content}>

            {user && (
              <>
                <Text style={Styles.sectionTitle} accessibilityRole="header">
                  成就系統
                </Text>
                <View style={styles.list}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Languages')}>
                    <View style={styles.item} accessible>
                      <Text>我的獎杯</Text>
                      <Text>999個</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}>
                    <View style={styles.item} accessible>
                      <Text>我的積分</Text>
                      <Text>88000分</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <Text style={Styles.sectionTitle} accessibilityRole="header">
                  遊歷記錄
                </Text>
                <View style={styles.list}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Languages')}>
                    <View style={styles.item} accessible>
                      <Text>學習路徑</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Languages')}>
                    <View style={styles.item} accessible>
                      <Text>館內合照</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <Text style={Styles.sectionTitle} accessibilityRole="header">
              {t('profile.settings.title')}
            </Text>
            <View style={styles.list}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Languages')}
                accessible
                accessibilityRole="button">
                <View style={styles.item}>
                  <Text>{t('profile.languages.title')}</Text>
                  <Text>{t('language.' + i18n.language)}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {false && user && (
              <>
                <Text style={Styles.sectionTitle} accessibilityRole="header">
                  {t('profile.last-visit.title')}
                </Text>
                <View style={styles.list}>
                  <View style={styles.item} accessible>
                    <Text>{t('profile.last-visit.date')}</Text>
                    <Text>2023/03/12</Text>
                  </View>

                  <View style={styles.item} accessible>
                    <Text>{t('profile.last-visit.duration')}</Text>
                    <Text>1h 30m</Text>
                  </View>
                </View>

                <Text style={Styles.sectionTitle} accessibilityRole="header">
                  {t('profile.stat.title')}
                </Text>
                <View style={styles.list}>
                  <View style={styles.item} accessible>
                    <Text>{t('profile.stat.total-duration')}</Text>
                    <Text>12h 43m</Text>
                  </View>

                  <View style={styles.item} accessible>
                    <Text>{t('profile.stat.exhibitions-visited')}</Text>
                    <Text>8 個</Text>
                  </View>

                  <View style={styles.item} accessible>
                    <Text>{t('profile.stat.works-visited')}</Text>
                    <Text>38 個</Text>
                  </View>
                </View>
              </>
            )}

            {user && (
              <>

                <Text style={Styles.sectionTitle} accessibilityRole="header">
                  {t('profile.account.title')}
                </Text>

                <TouchableOpacity onPress={logout}>
                  <View style={styles.list}>
                    <View style={styles.item} accessible>
                      <Text>
                        {t(
                          `profile.account.${user?.providerData[0]?.providerId}`,
                        )}
                      </Text>
                      <Text>{t('profile.account.logout')}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {!user && (
              <>
                <Text style={Styles.sectionTitle} accessibilityRole="header">
                  {t('profile.login.title')}
                </Text>
                <View style={styles.list}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EmailLogin')}>
                    <View style={styles.item} accessible>
                      <Text>{t('profile.login.password')}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('SmsLogin')}>
                    <View style={styles.item} accessible>
                      <Text>{t('profile.login.sms')}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={loginGoogle}>
                    <View style={styles.item} accessible>
                      <Text>{t('profile.login.google')}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={loginFacebook}>
                    <View style={styles.item} accessible>
                      <Text>{t('profile.login.facebook')}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <View style={styles.item} accessible>
                      <Text>{t('profile.login.wechat')}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  titleContainer: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatar: {
    backgroundColor: '#FFF',
    width: 60,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#AAA',
    borderStyle: 'solid',
    borderRadius: 30,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  title: {
    marginBottom: 0,
  },
  contentContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  content: {
    padding: 20,
  },
  list: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 20,
    gap: -8,
  },
  item: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
