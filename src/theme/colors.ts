/**
 * Color tokens for ShopX Elite Pro Max.
 *
 * Tokens are split into a `light` and `dark` palette. Each palette
 * exposes the same shape so screens can pull values without conditionals.
 */

export interface ColorPalette {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceHigh: string;
  surfaceGlass: string;
  surfaceGlassStrong: string;
  divider: string;
  border: string;
  shadow: string;

  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  primary: string;
  primaryStrong: string;
  primarySoft: string;
  onPrimary: string;

  accent: string;
  accentStrong: string;
  accentSoft: string;
  onAccent: string;

  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  info: string;
  infoSoft: string;

  rating: string;
  badge: string;
  shimmerBase: string;
  shimmerHighlight: string;

  gradientPrimary: [string, string];
  gradientAurora: [string, string, string];
  gradientSunset: [string, string, string];
  gradientOcean: [string, string, string];
  gradientNeon: [string, string, string];
  gradientCard: [string, string];
  gradientCardSoft: [string, string];

  neumorphLight: string;
  neumorphDark: string;
}

export const lightPalette: ColorPalette = {
  background: '#F4F6FB',
  backgroundElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceHigh: '#F1F4FA',
  surfaceGlass: 'rgba(255, 255, 255, 0.55)',
  surfaceGlassStrong: 'rgba(255, 255, 255, 0.75)',
  divider: 'rgba(20, 24, 35, 0.08)',
  border: 'rgba(20, 24, 35, 0.12)',
  shadow: 'rgba(20, 24, 35, 0.18)',

  text: '#0B0F1A',
  textSecondary: '#3B4458',
  textMuted: '#6E778A',
  textInverse: '#FFFFFF',

  primary: '#5B5BFF',
  primaryStrong: '#3D3DEB',
  primarySoft: 'rgba(91, 91, 255, 0.16)',
  onPrimary: '#FFFFFF',

  accent: '#FF4D8D',
  accentStrong: '#E0306E',
  accentSoft: 'rgba(255, 77, 141, 0.16)',
  onAccent: '#FFFFFF',

  success: '#1AAE6F',
  successSoft: 'rgba(26, 174, 111, 0.16)',
  warning: '#F2A700',
  warningSoft: 'rgba(242, 167, 0, 0.18)',
  danger: '#E0395A',
  dangerSoft: 'rgba(224, 57, 90, 0.18)',
  info: '#3596F6',
  infoSoft: 'rgba(53, 150, 246, 0.18)',

  rating: '#F5A524',
  badge: '#FF4D8D',
  shimmerBase: '#E5E8F0',
  shimmerHighlight: '#F5F7FB',

  gradientPrimary: ['#5B5BFF', '#8E5BFF'],
  gradientAurora: ['#FF7AD9', '#9C5BFF', '#3596F6'],
  gradientSunset: ['#FFB46B', '#FF6F91', '#9D4EDD'],
  gradientOcean: ['#48C6EF', '#6F86D6', '#5B5BFF'],
  gradientNeon: ['#00F5A0', '#00D9F5', '#5B5BFF'],
  gradientCard: ['#FFFFFF', '#F1F4FA'],
  gradientCardSoft: ['#F8FAFD', '#EEF1F8'],

  neumorphLight: '#FFFFFF',
  neumorphDark: 'rgba(166, 175, 195, 0.55)',
};

export const darkPalette: ColorPalette = {
  background: '#0B0F1A',
  backgroundElevated: '#10162A',
  surface: '#141B30',
  surfaceHigh: '#1A2240',
  surfaceGlass: 'rgba(20, 27, 48, 0.55)',
  surfaceGlassStrong: 'rgba(20, 27, 48, 0.75)',
  divider: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.14)',
  shadow: 'rgba(0, 0, 0, 0.6)',

  text: '#F5F7FB',
  textSecondary: '#B7C0D6',
  textMuted: '#7E8AA4',
  textInverse: '#0B0F1A',

  primary: '#8E8EFF',
  primaryStrong: '#5B5BFF',
  primarySoft: 'rgba(142, 142, 255, 0.22)',
  onPrimary: '#0B0F1A',

  accent: '#FF6FA5',
  accentStrong: '#FF4D8D',
  accentSoft: 'rgba(255, 111, 165, 0.22)',
  onAccent: '#0B0F1A',

  success: '#3DD598',
  successSoft: 'rgba(61, 213, 152, 0.22)',
  warning: '#FFC857',
  warningSoft: 'rgba(255, 200, 87, 0.22)',
  danger: '#FF6E8A',
  dangerSoft: 'rgba(255, 110, 138, 0.22)',
  info: '#5BC0FF',
  infoSoft: 'rgba(91, 192, 255, 0.22)',

  rating: '#FFC857',
  badge: '#FF6FA5',
  shimmerBase: '#1A2240',
  shimmerHighlight: '#243057',

  gradientPrimary: ['#8E8EFF', '#C18EFF'],
  gradientAurora: ['#FF8FE0', '#A877FF', '#5BC0FF'],
  gradientSunset: ['#FFC57A', '#FF8FA3', '#B27BFF'],
  gradientOcean: ['#5DD0FF', '#7E96FF', '#8E8EFF'],
  gradientNeon: ['#3DD598', '#5BC0FF', '#8E8EFF'],
  gradientCard: ['#1A2240', '#10162A'],
  gradientCardSoft: ['#141B30', '#0B0F1A'],

  neumorphLight: '#1F2A4A',
  neumorphDark: '#070A14',
};
