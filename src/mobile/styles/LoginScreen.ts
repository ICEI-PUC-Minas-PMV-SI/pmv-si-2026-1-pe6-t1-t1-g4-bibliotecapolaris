import { Colors, Fonts } from '@/constants/Theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'space-between',
  },

  formContainer: {
    gap: 16,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,

    width: '58%',
    borderBottomWidth: 4,
    borderBottomColor: Colors.buttonActive,

    alignSelf: 'flex-start',
    letterSpacing: 2,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.text,

    padding: 12,
    borderRadius: 4,

    fontSize: 18,
    color: Colors.text,
  },

  button: {
    height: 48,
    borderRadius: 4,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: Colors.buttonActive,
  },

  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.background,
  },

  footer: {
    alignSelf: 'center',
    flexDirection: 'row',

    marginTop: 12,
    marginBottom: 12,
  },

  footerText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },

  link: {
    fontSize: 16,
    color: Colors.buttonActive,
    fontWeight: '600',
  },
});
