import { registerSchema, fieldErrors } from '@freshpress/validation';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { RequestError, useAuth } from '../../src/auth/AuthContext';
import { Button, Input, Screen, Text } from '../../src/components/ui';

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
        setErrors({ _: 'Something went wrong. Try again.' });
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
        <Pressable onPress={() => router.back()} className="flex-row items-center py-2 -ml-1">
          <ChevronLeft size={24} color="#574235" />
          <Text variant="body" className="text-muted">
            Back
          </Text>
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View className="pt-6 pb-8">
            <Text variant="display">Create{'\n'}account.</Text>
            <Text variant="body" className="mt-3">
              Start juicing smarter in seconds.
            </Text>
          </View>

          <View className="gap-5">
            <Input
              label="Name"
              value={form.name}
              onChangeText={set('name')}
              error={errors.name}
              placeholder="Your name"
              autoCapitalize="words"
            />
            <Input
              label="Email"
              value={form.email}
              onChangeText={set('email')}
              error={errors.email}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label="Password"
              value={form.password}
              onChangeText={set('password')}
              error={errors.password}
              placeholder="At least 8 characters"
              secureTextEntry
            />
            <Input
              label="Confirm password"
              value={form.confirmPassword}
              onChangeText={set('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="Re-enter password"
              secureTextEntry
            />
            {errors._ ? (
              <Text variant="caption" className="text-[#d23b30] tracking-normal">
                {errors._}
              </Text>
            ) : null}
          </View>

          <View className="gap-4 pt-8 pb-2">
            <Button title="Create Account" loading={loading} onPress={onSubmit} />
            <Pressable onPress={() => router.replace('/(auth)/login')} className="items-center py-2">
              <Text variant="body" className="text-amber">
                Already have an account? <Text className="font-bold text-amber">Log in</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
