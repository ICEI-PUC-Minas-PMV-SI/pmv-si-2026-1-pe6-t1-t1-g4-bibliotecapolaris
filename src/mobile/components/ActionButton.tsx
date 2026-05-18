import { Image, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/Theme';

interface ActionButtonProps extends PressableProps {
  title?: string;
  icon?: any;

  variant?: 'fill' | 'outline';
}

export function ActionButton({
  title = '',
  icon,

  variant = 'fill',

  disabled,

  ...props
}: ActionButtonProps) {
  const hasTitle = !!title;
  const hasIcon = !!icon;

  const variantStyle = variant === 'fill' ? styles.fill : styles.outline;

  const spacingStyle = hasTitle && hasIcon ? styles.withIconAndText : hasTitle ? styles.onlyText : styles.onlyIcon;

  return (
    <Pressable
      disabled={disabled}
      style={[styles.container, variantStyle, spacingStyle, disabled && styles.disabled]}
      {...props}
    >
      {hasTitle && (
        <Text style={[styles.text, variant === 'fill' ? styles.fillText : styles.outlineText]}>{title}</Text>
      )}

      {hasIcon && (
        <View style={styles.iconContainer}>
          <Image source={icon} style={styles.image} resizeMode="contain" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderRadius: 4,
  },

  fill: {
    backgroundColor: Colors.buttonActive,
    borderColor: Colors.buttonTextActive,
  },

  outline: {
    backgroundColor: Colors.buttonInactive,
    borderColor: Colors.buttonTextInactive,
  },

  withIconAndText: {
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 4,

    gap: 8,
  },

  onlyText: {
    paddingHorizontal: 32,
    paddingVertical: 8,
  },

  onlyIcon: {
    padding: 4,
  },

  text: {
    fontWeight: 'bold',
    fontFamily: Fonts.serif,
    textTransform: 'uppercase',
  },

  fillText: {
    color: Colors.buttonTextActive,
  },

  outlineText: {
    color: Colors.buttonTextInactive,
  },

  iconContainer: {
    width: '50%',
  },

  image: {
    width: 64,
    height: 40,
  },

  disabled: {
    opacity: 0.5,
  },
});
