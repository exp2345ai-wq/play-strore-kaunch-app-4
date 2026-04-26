import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Banner } from '../types';
import { AnimatedTouchable } from './AnimatedTouchable';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - 32;

interface BannerCarouselProps {
  banners: Banner[];
  onPressBanner?: (b: Banner) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, onPressBanner }) => {
  const theme = useTheme();
  const ref = useRef<FlatList<Banner>>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % banners.length;
        ref.current?.scrollToOffset({ offset: next * (CARD_W + 12), animated: true });
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [banners.length]);

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={ref}
        data={banners}
        keyExtractor={(b) => b.id}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_W + 12}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setActive(Math.round(x / (CARD_W + 12)));
        }}
        renderItem={({ item }) => (
          <AnimatedTouchable
            onPress={() => onPressBanner?.(item)}
            hapticKind="light"
            style={[styles.cardWrap, { borderColor: theme.palette.border }]}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <LinearGradient
              colors={item.gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { opacity: 0.55 }]}
            />
            <View style={styles.content}>
              <Text style={[theme.typography.captionStrong, { color: '#FFFFFF' }]}>
                {item.cta.toUpperCase()}
              </Text>
              <Text
                style={[theme.typography.h2, { color: '#FFFFFF', marginTop: 4 }]}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text
                style={[theme.typography.body, { color: '#FFFFFFCC', marginTop: 4 }]}
                numberOfLines={2}
              >
                {item.subtitle}
              </Text>
              <View style={[styles.cta, { backgroundColor: '#FFFFFFEE' }]}>
                <Text style={[theme.typography.captionStrong, { color: '#0B0F1A' }]}>
                  {item.cta} →
                </Text>
              </View>
            </View>
          </AnimatedTouchable>
        )}
      />
      <View style={styles.dots}>
        {banners.map((b, i) => (
          <View
            key={b.id}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === active ? theme.palette.primary : theme.palette.divider,
                width: i === active ? 16 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingTop: 8 },
  cardWrap: {
    width: CARD_W,
    height: 170,
    marginRight: 12,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
  },
  image: { width: '100%', height: '100%', position: 'absolute' },
  content: { padding: 18, justifyContent: 'flex-end', flex: 1 },
  cta: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: { height: 6, borderRadius: 3 },
});
