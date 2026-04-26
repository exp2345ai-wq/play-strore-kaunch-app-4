import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../theme/ThemeContext';
import { useAIChat } from '../store/AIChatContext';
import { AnimatedTouchable } from './AnimatedTouchable';
import { formatRelativeTime } from '../utils/format';

export const FloatingAIAssistant: React.FC = () => {
  const theme = useTheme();
  const { messages, isOpen, isTyping, open, close, send, quickReplies, clear } = useAIChat();
  const [input, setInput] = useState('');
  const sheetRef = useRef<BottomSheet>(null);
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1.18, { duration: 1100 }), -1, true);
  }, [pulse]);

  React.useEffect(() => {
    if (isOpen) sheetRef.current?.expand();
    else sheetRef.current?.close();
  }, [isOpen]);

  const snapPoints = useMemo(() => ['72%', '92%'], []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 2 - pulse.value,
  }));

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    send(input);
    setInput('');
  }, [input, send]);

  return (
    <>
      <View style={styles.fabWrap} pointerEvents="box-none">
        <View style={styles.pulseHost}>
          <Animated.View
            style={[
              styles.pulse,
              pulseStyle,
              { backgroundColor: theme.palette.primary },
            ]}
          />
        </View>
        <AnimatedTouchable
          onPress={open}
          hapticKind="medium"
          style={[
            styles.fab,
            {
              shadowColor: theme.palette.primary,
            },
          ]}
        >
          <LinearGradient
            colors={theme.palette.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabFill}
          >
            <Ionicons name="sparkles" size={22} color={theme.palette.onPrimary} />
          </LinearGradient>
        </AnimatedTouchable>
      </View>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        enablePanDownToClose
        snapPoints={snapPoints}
        onClose={close}
        backgroundStyle={{ backgroundColor: theme.palette.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.palette.divider }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <View style={styles.headerRow}>
              <LinearGradient
                colors={theme.palette.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.aiAvatar}
              >
                <Ionicons name="sparkles" size={20} color={theme.palette.onPrimary} />
              </LinearGradient>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[theme.typography.h3, { color: theme.palette.text }]}>
                  ShopX Co-pilot
                </Text>
                <Text style={[theme.typography.caption, { color: theme.palette.textMuted }]}>
                  Mock responses · always-on shopping help
                </Text>
              </View>
              <AnimatedTouchable
                onPress={clear}
                hapticKind="warning"
                style={[
                  styles.clearBtn,
                  { borderColor: theme.palette.border },
                ]}
              >
                <Ionicons name="refresh" size={14} color={theme.palette.text} />
              </AnimatedTouchable>
            </View>

            <ScrollView
              contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.bubble,
                    m.role === 'assistant'
                      ? {
                          alignSelf: 'flex-start',
                          backgroundColor: theme.palette.primarySoft,
                        }
                      : {
                          alignSelf: 'flex-end',
                          backgroundColor: theme.palette.primary,
                        },
                  ]}
                >
                  <Text
                    style={[
                      theme.typography.body,
                      {
                        color:
                          m.role === 'assistant'
                            ? theme.palette.text
                            : theme.palette.onPrimary,
                      },
                    ]}
                  >
                    {m.content}
                  </Text>
                  <Text
                    style={[
                      theme.typography.micro,
                      {
                        color:
                          m.role === 'assistant'
                            ? theme.palette.textMuted
                            : '#FFFFFFAA',
                        marginTop: 4,
                      },
                    ]}
                  >
                    {formatRelativeTime(m.timestamp)}
                  </Text>
                </View>
              ))}
              {isTyping ? (
                <View
                  style={[
                    styles.bubble,
                    {
                      alignSelf: 'flex-start',
                      backgroundColor: theme.palette.primarySoft,
                    },
                  ]}
                >
                  <Text style={[theme.typography.body, { color: theme.palette.text }]}>
                    Typing…
                  </Text>
                </View>
              ) : null}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
            >
              {quickReplies.map((q) => (
                <AnimatedTouchable
                  key={q.id}
                  onPress={() => send(q.prompt)}
                  hapticKind="selection"
                  style={[
                    styles.quickChip,
                    {
                      backgroundColor: theme.palette.surfaceHigh,
                      borderColor: theme.palette.border,
                    },
                  ]}
                >
                  <Text style={{ marginRight: 6 }}>{q.emoji}</Text>
                  <Text style={[theme.typography.captionStrong, { color: theme.palette.text }]}>
                    {q.label}
                  </Text>
                </AnimatedTouchable>
              ))}
            </ScrollView>

            <View
              style={[
                styles.inputRow,
                { borderColor: theme.palette.border, backgroundColor: theme.palette.background },
              ]}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask anything…"
                placeholderTextColor={theme.palette.textMuted}
                style={[
                  styles.input,
                  theme.typography.body,
                  { color: theme.palette.text },
                ]}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <AnimatedTouchable
                onPress={handleSend}
                hapticKind="medium"
                style={styles.sendBtn}
              >
                <LinearGradient
                  colors={theme.palette.gradientPrimary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sendFill}
                >
                  <Ionicons name="send" size={16} color={theme.palette.onPrimary} />
                </LinearGradient>
              </AnimatedTouchable>
            </View>
          </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  fabWrap: {
    position: 'absolute',
    right: 18,
    bottom: 96,
    zIndex: 1000,
  },
  pulseHost: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.4,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  fabFill: {
    flex: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 38,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  sendFill: {
    flex: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
