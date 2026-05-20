import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    paddingBottom: 32,
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: Fonts.serif,
    textTransform: 'uppercase',
  },

  subtitle: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.6,
  },

  addButton: {
    marginHorizontal: 16,
    marginTop: 16,
    height: 48,
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
