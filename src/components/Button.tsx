import React, {ReactNode} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import useNavigation from '../hooks/useNavigation';
import {colors} from './Styles';

interface ButtonParams {
  title: string;
  link?: string;
  icon?: ReactNode;
  disabled?: boolean;
  primary?: boolean;
  onPress?: () => void;
}

export default function Button({
  title,
  link,
  icon,
  disabled,
  primary,
  onPress,
}: ButtonParams) {
  const navigation = useNavigation();

  function handlePress() {
    if (!onPress && link) {
      navigation.navigate(link);
    }

    if (onPress && !link) {
      onPress();
    }
  }
  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible
      accessibilityState={{disabled}}>
      <View
        style={[
          styles.container,
          primary && styles.primary,
          disabled && styles.disabled,
        ]}>
        {icon}
        <Text
          style={[
            styles.text,
            disabled && styles.disabledText,
            primary && styles.primaryText,
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DDD',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primary: {
    backgroundColor: colors.emphersis,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledText: {
    fontWeight: 'normal',
  },
  primaryText: {
    color: colors.primary,
  },
});
