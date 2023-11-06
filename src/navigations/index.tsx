import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  AcademicCapIcon as AcademicCapOutlineIcon,
  BeakerIcon as BeakerOutlineIcon,
  MagnifyingGlassIcon as MagnifyingGlassOutlineIcon,
  UserIcon as UserOutlineIcon,
} from 'react-native-heroicons/outline';
import {
  AcademicCapIcon as AcademicCapSolidIcon,
  BeakerIcon as BeakerSolidIcon,
  MagnifyingGlassIcon as MagnifyingGlassSolidIcon,
  UserIcon as UserSolidIcon,
} from 'react-native-heroicons/solid';
import {useTranslation} from 'react-i18next';

// 每個頁面會用到的 component
// MSC: 首頁
// MyMSCNav: 我的 MSC
// ExploreNav: 探索
// User: 帳戶
import User from './user';
import MSC from './msc';
import MyMSCNav from './mymsc';
import ExploreNav from './explore';

export type MainNavigatorParamList = {
  MSC: undefined;
  MyMSCNav: undefined;
  ExploreNav: undefined;
  User: undefined;
  More: undefined;
};



// k-test-start
// import { AccessibilityActionInfo } from 'react-native';

// import Tts from 'react-native-tts';

// Tts.setDefaultLanguage('en-GB')
// Tts.speak('Hello')
// Tts.speak('Wellcome')

// Tts.setDefaultLanguage('pt-PT');
// Tts.speak('Olá, este é o guia turístico');

// Tts.setDefaultLanguage('zh-HK');
// Tts.speak('你好你好');

// k-test-end


const Tab = createBottomTabNavigator<MainNavigatorParamList>();

// 4 個 tabs
// 1. MSC: 首頁
// 2. MyMSCNav: 我的 MSC
// 3. ExploreNav: 探索
// 4. User: 帳戶
export default function MainNavigator() {
  const {t} = useTranslation();
  
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="MSC"
          component={MSC}
          options={{
            title: `${t('msc.title-short')}`,
            headerShown: false,
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color, size, focused}) =>
              focused ? (
                <BeakerSolidIcon color={color} size={size} />
              ) : (
                <BeakerOutlineIcon color={color} size={size} />
              ),
            tabBarAccessibilityLabel: `${t('msc.title-short')}`,
          }}
        />
        <Tab.Screen
          name="MyMSCNav"
          component={MyMSCNav}
          options={{
            title: `${t('mymsc.title')}`,
            headerShown: false,
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color, size, focused}) =>
              focused ? (
                <AcademicCapSolidIcon color={color} size={size} />
              ) : (
                <AcademicCapOutlineIcon color={color} size={size} />
              ),
            tabBarAccessibilityLabel: `${t('mymsc.title')}`,
          }}
        />
        <Tab.Screen
          name="ExploreNav"
          component={ExploreNav}
          options={{
            title: `${t('explore.title')}`,
            headerShown: false,
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarLabel: ({color, focused, position}) => (
              <Text
                style={[
                  {color},
                  styles.label,
                  position === 'below-icon'
                    ? styles.labelBeneath
                    : styles.labelBeside,
                ]}>
                {focused ? t('explore.exploring') : t('explore.title')}
              </Text>
            ),
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color, size, focused}) =>
              focused ? (
                <MagnifyingGlassSolidIcon
                  color={color}
                  size={size}
                  style={{transform: [{translateY: focused ? 0 : 0}]}}
                />
              ) : (
                <MagnifyingGlassOutlineIcon
                  color={color}
                  size={size}
                  style={{transform: [{translateY: focused ? 0 : 0}]}}
                />
              ),
          }}
        />
        {<Tab.Screen
          name="User"
          component={User}
          options={{
            title: `${t('profile.title')}`,
            headerShown: false,
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color, size, focused}) =>
              focused ? (
                <UserSolidIcon color={color} size={size} />
              ) : (
                <UserOutlineIcon color={color} size={size} />
              ),
            // tabBarBadge: 1,
            tabBarAccessibilityLabel: `${t('profile.title')}`,
          }}
        />}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  labelBeside: {
    fontSize: 13,
    marginLeft: 20,
    marginTop: 3,
  },
  labelBeneath: {
    fontSize: 10,
  },
});
