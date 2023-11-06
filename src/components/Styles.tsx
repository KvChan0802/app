import {StyleSheet} from 'react-native';

export const colors = {
  primary: '#42397A',
  emphersis: '#F4C94D',
  contrast: '#E74C3C',
  background: '#F3F0F9',
  white: '#FFFFFF',
  black: '#000000',
  disabled: '#DDDDDD',
  gray: '#666666',
};

export default StyleSheet.create({
  title: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    color: '#999',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -8,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 16 * 1.62,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
