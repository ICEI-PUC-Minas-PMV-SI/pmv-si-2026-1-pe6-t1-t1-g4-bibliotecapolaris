import { Colors, Fonts } from '@/constants/Theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
    gap: 24,
  },

  section: {
    zIndex: 10,
    marginTop: -24,
  },

  heroContainer: {
    height: 160,
    position: 'relative',
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  searchContainer: {
    position: 'absolute',

    bottom: 0,

    width: '100%',

    paddingHorizontal: 20,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 16,
    transform: [{ translateY: 16 }],
  },

  input: {
    flex: 1,
    backgroundColor: 'white',

    paddingHorizontal: 8,
    borderRadius: 2,
    fontSize: 10,
  },

  booksSection: {
    gap: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  booksTitle: {
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
    width: '100%',
    textAlign: 'center',

    fontSize: 28,
    textTransform: 'uppercase',
  },

  categoriesSection: {
    gap: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  categoriesTitle: {
    width: '100%',
    fontSize: 20,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Colors.text,
    fontFamily: Fonts.serif,
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
});
