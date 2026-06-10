import type { HelpTopic } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { CircleHelp, MessageCircle, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../src/api/client';
import { BottomSheet } from '../src/components/BottomSheet';
import { ListRow, SectionHeader } from '../src/components/FreshPressPrimitives';
import { BackBar, Button, Card, Screen, Text } from '../src/components/ui';
import { t } from '../src/i18n/strings';

const categoryLabel = (c: string) => t.help.categories[c] ?? c;

export default function Help() {
  const router = useRouter();
  const [topics, setTopics] = useState<HelpTopic[]>([]);
  const [selected, setSelected] = useState<HelpTopic | null>(null);
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  useEffect(() => {
    api
      .helpTopics()
      .then((r) => setTopics(r.topics))
      .catch(() => setTopics([]));
  }, []);

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <View className="gap-2 pt-2">
          <Text variant="display" className="text-[34px] leading-[42px]">
            {t.help.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.help.subtitle}
          </Text>
        </View>

        <View className="min-h-[52px] flex-row items-center gap-3 rounded-md border border-hairline bg-card px-4">
          <Search size={20} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t.help.searchPlaceholder}
            placeholderTextColor={colors.muted}
            selectionColor={colors.orange}
            returnKeyType="search"
            className="flex-1 py-3 font-sans text-[15px] text-ink"
          />
        </View>

        <Card className="flex-row items-center gap-3 bg-green/30 border-green/60">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-card">
            <MessageCircle size={22} color={colors.greenInk} />
          </View>
          <View className="min-w-0 flex-1">
            <Text variant="h3" className="text-[18px] leading-[24px]">
              {t.help.supportTitle}
            </Text>
            <Text variant="body" className="text-[14px] leading-[20px]">
              {t.help.supportBody}
            </Text>
          </View>
        </Card>

        {(['device', 'recipes', 'account'] as const).map((category) => {
          const group = topics.filter(
            (topic) =>
              topic.category === category && (!q || topic.title.toLowerCase().includes(q)),
          );
          if (!group.length) return null;
          return (
            <View key={category} className="gap-3">
              <SectionHeader title={categoryLabel(category)} />
              <Card className="gap-0 p-0">
                {group.map((topic, index) => (
                  <ListRow
                    key={topic.id}
                    title={topic.title}
                    subtitle={t.help.tapForAnswer}
                    icon={<CircleHelp size={20} color={colors.amber} />}
                    onPress={() => setSelected(topic)}
                    last={index === group.length - 1}
                  />
                ))}
              </Card>
            </View>
          );
        })}

        <Button
          title={t.help.goToSettings}
          variant="secondary"
          onPress={() => router.push('/settings')}
        />
      </ScrollView>

      <BottomSheet
        visible={Boolean(selected)}
        title={selected?.title ?? t.help.title}
        subtitle={selected ? categoryLabel(selected.category) : undefined}
        onClose={() => setSelected(null)}
      >
        <Card className="gap-3">
          <Text variant="body" className="text-ink">
            {selected?.body}
          </Text>
        </Card>
        <Pressable
          onPress={() => setSelected(null)}
          className="min-h-[44px] items-center justify-center active:opacity-70"
        >
          <Text variant="eyebrow" className="text-amber">
            {t.help.close}
          </Text>
        </Pressable>
      </BottomSheet>
    </Screen>
  );
}
