import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from './Styles';

interface LocationBasedNotificationParams {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonAction: () => void;
}

export default function LocationBasedNotification({
  icon,
  title,
  subtitle,
  buttonLabel,
  buttonAction,
}: LocationBasedNotificationParams) {
  return (
    <View style={styles.container}>
      {icon}
      <View
        style={styles.content}
        accessible
        accessibilityLabel={`${title}。${subtitle}`}>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={buttonAction}>
          <Text style={styles.button}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    gap: 4,
  },
  subtitle: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: colors.emphersis,
    color: colors.primary,
    lineHeight: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '500',
  },
});
