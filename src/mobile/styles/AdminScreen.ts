import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,

    gap: 20,
  },

  section: {
    paddingHorizontal: 16,
    gap: 12,
  },

  flatListStyles: {
    paddingHorizontal: 16,
    marginTop: 20,
  },

  title: {
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: Fonts.serif,
    textTransform: 'uppercase',

    width: '100%',
  },

  subtitle: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.6,
  },

  buttonsSection: {
    display: 'flex',
    flexDirection: 'row',

    gap: 12,
  },

  addButton: {
    flex: 1,
  },

  loansContainer: {
    gap: 12,
    paddingVertical: 8,
  },

  emptyText: {
    color: Colors.text,
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
