import React, {useRef} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';

interface TouchableParams extends TouchableOpacityProps {
  children: React.ReactNode;
  onPress?: () => void;
  onDoublePress?: () => void;
}

export default function Touchable({
  children,
  onPress,
  onDoublePress,
  ...props
}: TouchableParams) {
  const timer = useRef<number | null>(null);

  function clear() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function handlePress() {
    if (timer.current === null) {
      timer.current = setTimeout(() => {
        clear();
        onPress?.();
      }, 300);
    } else {
      clear();
      onDoublePress?.();
    }
  }

  return (
    <TouchableOpacity {...props} onPress={handlePress}>
      {children}
    </TouchableOpacity>
  );
}
