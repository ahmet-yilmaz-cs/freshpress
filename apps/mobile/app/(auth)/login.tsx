import { loginSchema, fieldErrors } from '@freshpress/validation';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { RequestError, useAuth } from '../../src/auth/AuthContext';
import { AppleButton, BackBar, Button, Input, Screen, Text } from '../../src/components/ui';
import { t } from '../../src/i18n/strings';

export default function Login() {
  const router = useRouter();
  const { login, appleSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  async function onApple() {
    setAppleLoading(true);
    try {
      await appleSignIn();
    } finally {
      setAppleLoading(false);
    }
  }

  async function onSubmit() {
    setErrors({});
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      if (err instanceof RequestError) {
        setErrors(err.fields ?? { _: err.message });
      } else {
        setErrors({ _: t.auth.genericError });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen className="px-5">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <BackBar onPress={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View className="pb-8 pt-6">
            <Text variant="display">{t.auth.loginTitle}</Text>
            <Text variant="body" className="mt-3">
              {t.auth.loginSubtitle}
            </Text>
          </View>

          <View className="gap-5">
            <Input
              label={t.auth.email}
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              placeholder={t.auth.emailPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label={t.auth.password}
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              placeholder={t.auth.passwordPlaceholder}
              secureTextEntry
            />
            {errors._ ? (
              <Text variant="caption" className="text-danger tracking-normal">
                {errors._}
              </Text>
            ) : null}
            <Text variant="caption" className="tracking-normal">
              {t.auth.demoHint}
            </Text>
          </View>

          <View className="flex-1" />

          <View className="gap-3 pb-2 pt-8">
            <Button title={t.auth.loginCta} loading={loading} onPress={onSubmit} />
            <AppleButton onPress={onApple} loading={appleLoading} />
            <Pressable
              onPress={() => router.replace('/(auth)/register')}
              className="min-h-[44px] items-center justify-center"
            >
              <Text variant="body" className="text-amber">
                {t.auth.noAccount} <Text className="font-bold text-amber">{t.auth.signUp}</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
