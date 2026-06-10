import { registerSchema, fieldErrors } from '@freshpress/validation';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { RequestError, useAuth } from '../../src/auth/AuthContext';
import { BackBar, Button, Input, Screen, Text } from '../../src/components/ui';
import { t } from '../../src/i18n/strings';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function onSubmit() {
    setErrors({});
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));

    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
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
            <Text variant="display">{t.auth.registerTitle}</Text>
            <Text variant="body" className="mt-3">
              {t.auth.registerSubtitle}
            </Text>
          </View>

          <View className="gap-5">
            <Input
              label={t.auth.name}
              value={form.name}
              onChangeText={set('name')}
              error={errors.name}
              placeholder={t.auth.namePlaceholder}
              autoCapitalize="words"
            />
            <Input
              label={t.auth.email}
              value={form.email}
              onChangeText={set('email')}
              error={errors.email}
              placeholder={t.auth.emailPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label={t.auth.password}
              value={form.password}
              onChangeText={set('password')}
              error={errors.password}
              placeholder={t.auth.passwordHint}
              secureTextEntry
            />
            <Input
              label={t.auth.confirmPassword}
              value={form.confirmPassword}
              onChangeText={set('confirmPassword')}
              error={errors.confirmPassword}
              placeholder={t.auth.confirmPlaceholder}
              secureTextEntry
            />
            {errors._ ? (
              <Text variant="caption" className="text-danger tracking-normal">
                {errors._}
              </Text>
            ) : null}
          </View>

          <View className="gap-3 pb-2 pt-8">
            <Button title={t.auth.registerCta} loading={loading} onPress={onSubmit} />
            <Pressable
              onPress={() => router.replace('/(auth)/login')}
              className="min-h-[44px] items-center justify-center"
            >
              <Text variant="body" className="text-amber">
                {t.auth.haveAccount} <Text className="font-bold text-amber">{t.auth.signIn}</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
