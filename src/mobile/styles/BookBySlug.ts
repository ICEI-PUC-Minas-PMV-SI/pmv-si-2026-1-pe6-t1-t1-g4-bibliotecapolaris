import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,

    gap: 40,
  },

  content: {
    gap: 12,
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 48,
    paddingVertical: 24,
    position: 'relative',
  },

  likeButton: {
    position: 'absolute',
    top: '36.5%',
    right: '8%',
    zIndex: 10,
  },

  image: {
    width: 160,
    height: 200,

    borderWidth: 2,
    borderRadius: 4,
    borderColor: Colors.text,
  },

  information: {
    width: '100%',
    gap: 0,
  },

  title: {
    width: '90%',

    fontSize: 24,
    letterSpacing: 2,
    textAlign: 'left',
    fontWeight: '600',
    color: Colors.text,
    fontFamily: Fonts.serif,
    textTransform: 'uppercase',
  },

  author: {
    width: '80%',

    fontSize: 20,
    color: Colors.text,
    textAlign: 'left',
    fontFamily: Fonts.serif,
  },

  categories: {
    width: '100%',

    opacity: 0.8,
    fontSize: 20,
    color: Colors.text,
    textAlign: 'left',
    fontFamily: Fonts.serif,
  },

  description: {
    width: '100%',
    minHeight: 160,

    fontSize: 16,
    color: Colors.text,
    textAlign: 'justify',
    fontFamily: Fonts.sans,
  },

  available: {
    width: '100%',

    fontSize: 20,
    color: Colors.text,
    textAlign: 'justify',
    fontFamily: Fonts.serif,
  },
});
