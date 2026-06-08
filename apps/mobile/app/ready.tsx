import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleCheck } from 'lucide-react-native';
import { View } from 'react-native';

import { Button, Screen, Text } from '../src/components/ui';

/** Success screen — Figma frame "İçeceğiniz Hazır!" (11:606). */
export default function Ready() {
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title?: string }>();

  return (
    <Screen className="items-center justify-center px-8">
      <View className="h-44 w-44 items-center justify-center rounded-full bg-green">
        <CircleCheck size={84} color="#00721e" />
      </View>

      <Text variant="h2" className="mt-10 text-center">
        Your drink is ready!
      </Text>
      <Text variant="body" className="mt-2 text-center">
        {title ?? 'Your juice'} is freshly pressed and waiting. Enjoy! 🥤
      </Text>

      <View className="absolute inset-x-8 bottom-8">
        <Button title="Done" variant="primary" onPress={() => router.replace('/(tabs)')} />
      </View>
    </Screen>
  );
}
