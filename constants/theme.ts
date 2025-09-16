/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';


// デザインシステム用カラーパレット
export const Colors = {
  light: {
    primaryGreen: '#55AE3A',
    lightGreenBackground: '#F0FFF4',
    cardBackground: '#FFFFFF',
    textColor: '#212121',
    subtleTextColor: '#555555',
    successColor: '#2E7D32',
    failureColor: '#C62828',
    borderColor: '#E0E0E0',
    red: '#FF0000',
  },
  dark: {
    primaryGreen: '#55AE3A',
    lightGreenBackground: '#1A1A1A',
    cardBackground: '#2D2D2D',
    textColor: '#FFFFFF',
    subtleTextColor: '#CCCCCC',
    successColor: '#4CAF50',
    failureColor: '#F44336',
    borderColor: '#404040',
    red: '#FF0000',
  },
  // 後方互換性のための直接アクセス
  primaryGreen: '#55AE3A',
  lightGreenBackground: '#F0FFF4',
  cardBackground: '#FFFFFF',
  textColor: '#212121',
  subtleTextColor: '#555555',
  successColor: '#2E7D32',
  failureColor: '#C62828',
  borderColor: '#E0E0E0',
  red: '#FF0000',
};

export const CardStyle = {
  borderRadius: 12,
  backgroundColor: Colors.cardBackground,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
  borderWidth: 1,
  borderColor: Colors.borderColor,
};

export const ButtonStyle = {
  borderRadius: 8,
  backgroundColor: Colors.primaryGreen,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
