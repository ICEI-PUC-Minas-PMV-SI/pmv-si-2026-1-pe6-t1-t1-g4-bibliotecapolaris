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
    backgroundColor: Colors.fairground,

    paddingHorizontal: 8,
    borderRadius: 2,

    fontSize: 13,
  },

  booksSection: {
    gap: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  sectionTitle: {
    width: '100%',

    fontSize: 20,
    letterSpacing: 2,
    color: Colors.text,
    fontFamily: Fonts.serif,
    textTransform: 'uppercase',
  },

  booksContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',

    gap: 16,
  },

  emptyText: {
    width: '100%',

    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  categoriesSection: {
    gap: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  categoriesContainer: {
    gap: 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
