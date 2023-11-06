import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface StepperParams {
  label: string;
  value: number;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
}

export default function Stepper({
  label,
  value,
  max,
  min,
  onChange,
}: StepperParams) {
  function increase() {
    onChange(!max || value < max ? value + 1 : max);
  }

  function decrease() {
    onChange(value > (min ?? 1) ? value - 1 : 0);
  }

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={label}
      accessibilityRole="adjustable"
      accessibilityValue={{text: `${value}`}}
      accessibilityActions={[
        {name: 'increment', label: '增加'},
        {name: 'decrement', label: '減少'},
      ]}
      onAccessibilityAction={event => {
        switch (event.nativeEvent.actionName) {
          case 'increment':
            increase();
            break;
          case 'decrement':
            decrease();
            break;
        }
      }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.changer}>
        {value > (min ?? 0) && (
          <TouchableOpacity onPress={decrease}>
            <Text style={styles.button}>-</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.value}>{value}</Text>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{opacity: max && value >= max ? 0 : 1}}>
          <TouchableOpacity onPress={increase}>
            <Text style={styles.button}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  changer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  button: {
    backgroundColor: 'lightgray',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  value: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    width: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
