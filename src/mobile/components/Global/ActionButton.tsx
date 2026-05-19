import React, { Image, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';

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

  style,

  ...props
}: ActionButtonProps) {
  const hasTitle = !!title;
  const hasIcon = !!icon;

  const variantStyle = variant === 'fill' ? styles.fill : styles.outline;

  const spacingStyle = hasTitle && hasIcon ? styles.withIconAndText : hasTitle ? styles.onlyText : styles.onlyIcon;

  return (
    <Pressable
      disabled={disabled}
      style={(state) => [
        styles.container,
        variantStyle,
        spacingStyle,
        disabled && styles.disabled,

        typeof style === 'function' ? style(state) : style,
      ]}
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

    borderWidth: 1,
    borderRadius: 4,

    minHeight: 36,
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
    paddingLeft: 12,
    paddingRight: 10,
    paddingVertical: 4,

    gap: 6,
  },

  onlyText: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  onlyIcon: {
    padding: 6,
    minWidth: 36,
    minHeight: 36,
  },

  text: {
    fontSize: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 22,
    height: 22,
  },

  disabled: {
    opacity: 0.5,
  },
});
