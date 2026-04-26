import { TextStyle } from 'react-native';

export interface TypographyScale {
  display: TextStyle;
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  bodyStrong: TextStyle;
  caption: TextStyle;
  captionStrong: TextStyle;
  micro: TextStyle;
  button: TextStyle;
  link: TextStyle;
  mono: TextStyle;
  number: TextStyle;
}

export const typography: TypographyScale = {
  display: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1.2,
    lineHeight: 46,
  },
  h1: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  h4: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.1,
    lineHeight: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyStrong: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  captionStrong: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  micro: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    lineHeight: 14,
  },
  button: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  mono: {
    fontSize: 13,
    fontFamily: 'Menlo',
    lineHeight: 18,
  },
  number: {
    fontSize: 28,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
};
