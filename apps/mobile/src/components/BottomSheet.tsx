import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { Dimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@freshpress/design-system';

import { Text } from './ui';

const MAX_HEIGHT = Dimensions.get('window').height * 0.9;

/**
 * App bottom sheet, built on @gorhom/bottom-sheet: gesture-driven (drag-to-dismiss),
 * tappable backdrop, dynamic height that fits the content, and keyboard-aware so
 * inputs (e.g. the Add Recipe form) are never covered. Driven by a `visible` prop
 * so call sites stay declarative.
 */
export function BottomSheet({
  visible,
  title,
  subtitle,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) ref.current?.present();
    else ref.current?.dismiss();
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      maxDynamicContentSize={MAX_HEIGHT}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      handleIndicatorStyle={{ backgroundColor: colors.track, width: 44 }}
      backgroundStyle={{
        backgroundColor: colors.bg,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 24,
          gap: 12,
        }}
      >
        <View className="pb-1">
          <Text variant="h3">{title}</Text>
          {subtitle ? (
            <Text variant="body" className="mt-1 text-[14px] leading-[20px]">
              {subtitle}
            </Text>
          ) : null}
        </View>
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
