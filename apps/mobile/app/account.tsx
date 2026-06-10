import { useRouter } from 'expo-router';
import { KeyRound, Mail, ShieldCheck, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { useAuth } from '../src/auth/AuthContext';
import { ListRow, SectionHeader } from '../src/components/FreshPressPrimitives';
import { BackBar, Button, Card, Input, Screen, Text } from '../src/components/ui';
import { t } from '../src/i18n/strings';

export default function Account() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await updateProfile({ name, email });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <View className="gap-2 pt-2">
          <Text variant="display" className="text-[34px] leading-[42px]">
            {t.account.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.account.subtitle}
          </Text>
        </View>

        <Card className="items-center gap-3">
          <View className="h-20 w-20 items-center justify-center rounded-full border border-border-warm bg-track">
            <Text variant="h2" className="text-amber">
              {(name[0] ?? 'F').toUpperCase()}
            </Text>
          </View>
          <Text variant="h3">{name || t.account.defaultName}</Text>
          <Text variant="caption" className="tracking-normal">
            {t.account.memberSince} {user?.createdAt.slice(0, 10) ?? t.account.mockSession}
          </Text>
        </Card>

        <SectionHeader title={t.account.profileDetails} />
        <Card className="gap-4">
          <Input
            label={t.auth.name}
            value={name}
            onChangeText={setName}
            placeholder={t.auth.namePlaceholder}
          />
          <Input
            label={t.auth.email}
            value={email}
            onChangeText={setEmail}
            placeholder={t.auth.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button title={saved ? t.account.saved : t.account.save} loading={saving} onPress={save} />
        </Card>

        <SectionHeader title={t.account.security} />
        <Card className="gap-0 p-0">
          <ListRow
            title={t.account.password}
            subtitle={t.account.passwordSub}
            icon={<KeyRound size={20} color={colors.amber} />}
          />
          <ListRow
            title={t.account.verifiedEmail}
            subtitle={email || t.account.noEmail}
            icon={<Mail size={20} color={colors.amber} />}
          />
          <ListRow
            title={t.account.localSession}
            subtitle={t.account.localSessionSub}
            icon={<ShieldCheck size={20} color={colors.amber} />}
            last
          />
        </Card>

        <View className="flex-row items-center justify-center gap-2">
          <UserRound size={14} color={colors.muted} />
          <Text variant="caption" className="text-center tracking-normal">
            {t.account.footer}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
