import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,

    gap: 24,
  },

  section: {
    zIndex: 10,

    marginTop: -24,
  },

  heroContainer: {
    height: 400,

    position: 'relative',
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  searchContainer: {
    position: 'absolute',

    bottom: 0,

    left: '10%',

    width: '80%',

    flexDirection: 'row',

    alignItems: 'center',

    gap: 16,

    transform: [{ translateY: 40 }],
  },

  input: {
    flex: 1,

    backgroundColor: 'white',

    paddingHorizontal: 20,

    paddingVertical: 12,

    borderRadius: 8,

    fontSize: 18,
  },
});
