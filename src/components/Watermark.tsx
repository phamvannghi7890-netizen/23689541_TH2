import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WATERMARK_TEXT, VARIANT } from '@constants/student';
import { theme } from '@constants/theme';

interface WatermarkProps {
  forcePosition?: 'top' | 'bottom';
}

export const Watermark: React.FC<WatermarkProps> = ({ forcePosition }) => {
  const isTop = forcePosition ? forcePosition === 'top' : VARIANT.watermarkAtTop;

  return (
    <View style={[styles.container, isTop ? styles.positionTop : styles.positionBottom]}>
      <View style={styles.badge}>
        <View style={styles.dot} />
        <Text style={styles.text} numberOfLines={1}>
          {WATERMARK_TEXT}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: 999,
  },
  positionTop: {
    paddingTop: 6,
    paddingBottom: 4,
  },
  positionBottom: {
    paddingBottom: 8,
    paddingTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE', // Blue 100
    borderWidth: 1,
    borderColor: '#93C5FD',     // Blue 300
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.3,
  },
});
