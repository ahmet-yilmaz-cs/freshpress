import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@freshpress/design-system';

import { useAuth } from '../../src/auth/AuthContext';
import { Reveal } from '../../src/components/Reveal';
import { AppleButton, Badge, Button, Screen, Text } from '../../src/components/ui';
import { t } from '../../src/i18n/strings';
import { images } from '../../src/lib/images';
import { alpha } from '../../src/lib/visuals';

export default function Welcome() {
  const router = useRouter();
  const { appleSignIn } = useAuth();
  const [appleLoading, setAppleLoading] = useState(false);

  async function onApple() {
    setAppleLoading(true);
    try {
      await appleSignIn();
    } finally {
      setAppleLoading(false);
    }
  }

  return (
    <Screen edges={['bottom']}>
      {/* Light status-bar icons sit over the darkened top of the hero photo. */}
      <StatusBar style="light" />

      {/* Full-bleed product photo: bleeds under the status bar, rounds off at the
          bottom so it melts into the page. Scrims add depth + text legibility. */}
      <View className="overflow-hidden rounded-b-[36px]" style={{ flex: 1.2 }}>
        <Image source={images.heroJuicer} resizeMode="cover" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={[alpha(colors.ink, 0.38), 'transparent', alpha(colors.ink, 0.58)]}
          locations={[0, 0.42, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <View className="flex-1 justify-between px-6 pb-7 pt-3">
            <Reveal delay={80} distance={10}>
              <Text variant="h3" className="text-[22px] font-bold text-white">
                FreshPress
              </Text>
            </Reveal>
            <Reveal delay={560} distance={14}>
              <View className="flex-row">
                <Badge label={t.welcome.badge} tone="fresh" />
              </View>
            </Reveal>
          </View>
        </SafeAreaView>
      </View>

      {/* Copy + actions, revealed in a smooth downward stagger. */}
      <View className="flex-1 justify-between px-6 pt-7">
        <View className="gap-3">
          <Reveal delay={180}>
            <Text variant="display" className="text-[36px] leading-[42px]">
              {t.welcome.title}
            </Text>
          </Reveal>
          <Reveal delay={260}>
            <Text variant="body" className="text-[15px] leading-[22px]">
              {t.welcome.subtitle}
            </Text>
          </Reveal>
        </View>

        <View className="gap-3 pb-2">
          <Reveal delay={360}>
            <Button
              title={t.welcome.getStarted}
              variant="primary"
              onPress={() => router.push('/(auth)/register')}
            />
          </Reveal>
          <Reveal delay={420}>
            <Button
              title={t.welcome.login}
              variant="secondary"
              onPress={() => router.push('/(auth)/login')}
            />
          </Reveal>
          <Reveal delay={480}>
            <AppleButton onPress={onApple} loading={appleLoading} />
          </Reveal>
        </View>
      </View>
    </Screen>
  );
}
