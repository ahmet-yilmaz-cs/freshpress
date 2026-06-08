import { loginSchema, fieldErrors } from '@freshpress/validation';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { RequestError, useAuth } from '../../src/auth/AuthContext';
import { AppleButton, Button, Input, Screen, Text } from '../../src/components/ui';

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
            <Text variant="display">Welcome{'\n'}back.</Text>
            <Text variant="body" className="mt-3">
              Log in to control your FreshPress.
            </Text>
          </View>

          <View className="gap-5">
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              placeholder="••••••••"
              secureTextEntry
            />
            {errors._ ? (
              <Text variant="caption" className="text-[#d23b30] tracking-normal">
                {errors._}
              </Text>
            ) : null}
            <Text variant="caption" className="tracking-normal">
              Demo: demo@freshpress.app / Demo1234
            </Text>
          </View>

          <View className="flex-1" />

          <View className="gap-4 pt-8 pb-2">
            <Button title="Log In" loading={loading} onPress={onSubmit} />
            <AppleButton onPress={onApple} loading={appleLoading} />
            <Pressable onPress={() => router.replace('/(auth)/register')} className="items-center py-2">
              <Text variant="body" className="text-amber">
                Don&apos;t have an account? <Text className="font-bold text-amber">Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
