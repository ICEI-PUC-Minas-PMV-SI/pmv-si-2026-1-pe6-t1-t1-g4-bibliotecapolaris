import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
    gap: 24,
  },

  section: {
    gap: 16,

    marginTop: 20,
    paddingHorizontal: 20,
  },

  title: {
    width: '100%',
    fontSize: 20,
    color: Colors.text,
    fontFamily: Fonts.serif,

    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  booksContainer: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'center',

    gap: 16,
  },

  emptyText: {
    textAlign: 'center',

    fontSize: 24,

    fontWeight: '600',
  },
});
