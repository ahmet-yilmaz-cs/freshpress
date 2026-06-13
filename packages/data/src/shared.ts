import type {
  CreateRecipeInput,
  HelpTopic,
  JuiceProgram,
  JuicingSession,
  Recipe,
  Recommendation,
  StockItem,
} from '@freshpress/types';

/** Curated recipe catalog (Turkish copy). Visual treatment is resolved by the mobile design system. */
export const recipes: Recipe[] = [
  {
    id: 'r-green-detox',
    title: 'Yeşil Detoks',
    description: 'Yeşil yapraklılar, salatalık, limon ve zencefille temiz bir sabah başlangıcı.',
    category: 'Detoks',
    tone: 'green',
    calories: 120,
    durationSec: 95,
    ingredients: ['Karalahana', 'Yeşil elma', 'Salatalık', 'Limon', 'Zencefil'],
    steps: [
      'Yeşillikleri yıka',
      'Elma ve salatalığı dörde böl',
      'Orta hızda sık',
      'Servisten önce karıştır',
    ],
    benefits: ['Nem', 'K vitamini', 'Hafif sindirim'],
  },
  {
    id: 'r-citrus-burst',
    title: 'Narenciye Patlaması',
    description: 'Parlak narenciye ve havuç, zerdeçalla keskin bir öğleden sonra dinçliği.',
    category: 'Enerji',
    tone: 'orange',
    calories: 160,
    durationSec: 70,
    ingredients: ['Portakal', 'Greyfurt', 'Havuç', 'Zerdeçal'],
    steps: ['Narenciyeyi soy', 'Havucu doğra', 'Yüksek hızda sık', 'Sonunda zerdeçal ekle'],
    benefits: ['C vitamini', 'Beta karoten', 'Doğal enerji'],
  },
  {
    id: 'r-berry-boost',
    title: 'Meyve Şöleni',
    description: 'Antrenman sonrası için meyveler ve muzla daha dolgun bir içecek.',
    category: 'Toparlanma',
    tone: 'amber',
    calories: 210,
    durationSec: 80,
    ingredients: ['Çilek', 'Yaban mersini', 'Muz', 'Badem sütü'],
    steps: ['Çilekleri ayıkla', 'Muzu dilimle', 'Yumuşak meyve modunu kullan', 'Soğuk servis et'],
    benefits: ['Antioksidan', 'Potasyum', 'Antrenman toparlanması'],
  },
  {
    id: 'r-tropical-sunrise',
    title: 'Tropik Gün Doğumu',
    description: 'Ananas, mango, hindistan cevizi suyu ve misket limonuyla yumuşak bir yaz profili.',
    category: 'Işıltı',
    tone: 'orange',
    calories: 190,
    durationSec: 85,
    ingredients: ['Ananas', 'Mango', 'Hindistan cevizi suyu', 'Misket limonu'],
    steps: [
      'Tropik meyveleri küp doğra',
      'Hindistan cevizi suyu ekle',
      'Düşük hızda sık',
      'Misket limonuyla bitir',
    ],
    benefits: ['Elektrolit', 'A vitamini', 'Ferahlatıcı bitiş'],
  },
  {
    id: 'r-beet-power',
    title: 'Pancar Gücü',
    description: 'Pancar, elma, havuç ve zencefille daha derin, topraksı bir karışım.',
    category: 'Performans',
    tone: 'amber',
    calories: 140,
    durationSec: 100,
    ingredients: ['Pancar', 'Elma', 'Havuç', 'Zencefil'],
    steps: ['Pancarı ovala', 'Elmayı dörde böl', 'Önce kökleri sık', 'Zencefili en son geçir'],
    benefits: ['Demir desteği', 'Nitrat', 'Bağışıklık desteği'],
  },
  {
    id: 'r-vitamin-c',
    title: 'C Vitamini Shot',
    description: 'Portakal, limon, zencefil ve acı biberle kompakt bir bağışıklık shot’ı.',
    category: 'Bağışıklık',
    tone: 'orange',
    calories: 90,
    durationSec: 55,
    ingredients: ['Portakal', 'Limon', 'Zencefil', 'Acı biber'],
    steps: ['Narenciyeyi soy', 'Zencefili ince dilimle', 'Yüksek hızda sık', 'Acı biberi az ekle'],
    benefits: ['C vitamini', 'Isıtıcı baharat', 'Hızlı servis'],
  },
  {
    id: 'r-watermelon-mint',
    title: 'Karpuz Nane',
    description: 'Karpuz, nane ve misket limonuyla az emekle hidrasyon içeceği.',
    category: 'Hidrasyon',
    tone: 'green',
    calories: 110,
    durationSec: 60,
    ingredients: ['Karpuz', 'Nane', 'Misket limonu'],
    steps: ['Karpuzu küp doğra', 'Nane yaprağı ekle', 'Düşük hızda sık', 'Buz üzerine servis et'],
    benefits: ['Nem', 'Hafif kalori', 'Serinletici bitiş'],
  },
  {
    id: 'r-energy-carrot',
    title: 'Havuç Limon Enerjisi',
    description: 'Havuç, portakal ve limonla doğal şekerlerden gelen temiz enerji patlaması.',
    category: 'Enerji',
    tone: 'orange',
    calories: 155,
    durationSec: 65,
    ingredients: ['Havuç', 'Portakal', 'Limon', 'Zencefil'],
    steps: ['Havuçları soy', 'Portakalı dörde böl', 'Orta hızda sık', 'Limon sıkarak servis et'],
    benefits: ['Beta karoten', 'C vitamini', 'Doğal enerji'],
  },
  {
    id: 'r-energy-beet-apple',
    title: 'Kırmızı Dinamit',
    description: 'Pancar, elma ve zencefille antrenman öncesi için güçlü, demir zengini karışım.',
    category: 'Enerji',
    tone: 'amber',
    calories: 178,
    durationSec: 88,
    ingredients: ['Pancar', 'Yeşil Elma', 'Zencefil', 'Limon'],
    steps: ['Pancarı ovala', 'Elmayı dörde böl', 'Zencefili ekle', 'Yüksek hızda sık'],
    benefits: ['Demir', 'Nitrat', 'Antrenman öncesi enerji'],
  },
  {
    id: 'r-immunity-ginger',
    title: 'Zencefil Kalkanı',
    description: 'Zencefil, limon ve nane ile yoğun bir bağışıklık takviyesi.',
    category: 'Bağışıklık',
    tone: 'amber',
    calories: 98,
    durationSec: 58,
    ingredients: ['Zencefil', 'Limon', 'Portakal', 'Nane'],
    steps: ['Zencefili ince dilimle', 'Narenciyeyi soy', 'Yüksek hızda sık', 'Nane ile servis et'],
    benefits: ['Anti-inflamatuar', 'C vitamini', 'Boğaz yumuşatıcı'],
  },
  {
    id: 'r-immunity-kale',
    title: 'Yeşil Kalkan',
    description: 'Karalahana, yeşil elma ve zencefille hücreleri destekleyen yeşil güç içeceği.',
    category: 'Bağışıklık',
    tone: 'green',
    calories: 126,
    durationSec: 78,
    ingredients: ['Karalahana', 'Yeşil Elma', 'Limon', 'Zencefil'],
    steps: ['Karalahanaları yıka', 'Elmayı parçala', 'Limon ekle', 'Düşük hızda yavaşça sık'],
    benefits: ['K vitamini', 'Antioksidan', 'Hücre koruması'],
  },
  {
    id: 'r-recovery-mint',
    title: 'Nane Toparlanması',
    description: 'Nane, limon ve elmadan taze, hafif antrenman sonrası içeceği.',
    category: 'Toparlanma',
    tone: 'green',
    calories: 135,
    durationSec: 72,
    ingredients: ['Nane', 'Limon', 'Yeşil Elma', 'Pancar'],
    steps: ['Nane yapraklarını yıka', 'Elmayı parçala', 'Limon sık', 'Orta hızda karıştır'],
    benefits: ['Kas toparlanması', 'Serinletici', 'Hafif kalori'],
  },
  {
    id: 'r-recovery-carrot',
    title: 'Havuç Toparlanması',
    description: 'Havuç, elma ve nane ile egzersiz sonrası kas toparlanmasını destekler.',
    category: 'Toparlanma',
    tone: 'orange',
    calories: 148,
    durationSec: 75,
    ingredients: ['Havuç', 'Yeşil Elma', 'Zencefil', 'Nane'],
    steps: ['Havuçları doğra', 'Elmayı ekle', 'Orta hızda sık', 'Nane ile tamamla'],
    benefits: ['Beta karoten', 'Anti-inflamatuar', 'Enerji yenileme'],
  },
];

export const programs: JuiceProgram[] = [
  { id: 'p-morning', name: 'Sabah Smoothie', volumeMl: 240, durationSec: 90, tone: 'orange' },
  { id: 'p-mid-detox', name: 'Öğle Detoks', volumeMl: 180, durationSec: 75, tone: 'green' },
  { id: 'p-evening', name: 'Akşam Detoks', volumeMl: 300, durationSec: 110, tone: 'amber' },
  { id: 'p-green', name: 'Yeşil Detoks', volumeMl: 260, durationSec: 100, tone: 'green' },
  { id: 'p-vitamin-c', name: 'C Vitamini', volumeMl: 150, durationSec: 55, tone: 'orange' },
];

/**
 * Live juicing (Preparing) screen content. Ingredients are processed in order:
 * the screen derives done/active/pending per item from overall progress.
 */
export const juicingSession: JuicingSession = {
  ingredients: [
    { id: 'ji-orange', name: 'Valensiya Portakalı', tone: 'orange' },
    { id: 'ji-ginger', name: 'Taze Zencefil', tone: 'amber' },
    { id: 'ji-apple', name: 'Yeşil Elma', tone: 'green' },
  ],
  benefits: ['Bağışıklık desteği', 'C vitamini'],
  rpmBySpeed: { low: 55, medium: 80, high: 110 },
};

export const recommendations: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Güne taze başla',
    subtitle: 'Yeşil Detoks ilk servisi hafif ve odaklı tutar.',
    recipeId: 'r-green-detox',
    tone: 'green',
  },
  {
    id: 'rec-2',
    title: 'Öğleden sonra düşüşünü yen',
    subtitle: 'Narenciye Patlaması, bir kahveden daha temiz bir enerji verir.',
    recipeId: 'r-citrus-burst',
    tone: 'orange',
  },
  {
    id: 'rec-3',
    title: 'Antrenman sonrası toparlan',
    subtitle: 'Meyve Şöleni daha dolgun, daha yavaş ve antrenman sonrası daha iyi.',
    recipeId: 'r-berry-boost',
    tone: 'amber',
  },
];

/** Shared device hopper. Mutated in-memory by the mobile mock service. */
export const stock: StockItem[] = [
  // --- Meyve (6 adet) ---
  { id: 's-apple',      name: 'Yeşil Elma', category: 'fruit',     level: 82, unit: 'pcs', amount: 9, caloriesPerUnit: 95, tone: 'green'  },
  { id: 's-orange',     name: 'Portakal',   category: 'fruit',     level: 45, unit: 'pcs', amount: 5, caloriesPerUnit: 62, tone: 'orange' },
  { id: 's-lemon',      name: 'Limon',      category: 'fruit',     level: 18, unit: 'pcs', amount: 2, caloriesPerUnit: 17, tone: 'orange' },
  { id: 's-strawberry', name: 'Çilek',      category: 'fruit',     level:  0, unit: 'pcs', amount: 0, caloriesPerUnit: 32, tone: 'orange' },
  { id: 's-pineapple',  name: 'Ananas',     category: 'fruit',     level:  0, unit: 'pcs', amount: 0, caloriesPerUnit: 78, tone: 'orange' },
  { id: 's-watermelon', name: 'Karpuz',     category: 'fruit',     level:  0, unit: 'pcs', amount: 0, caloriesPerUnit: 55, tone: 'green'  },
  // --- Sebze (6 adet) ---
  { id: 's-kale',       name: 'Karalahana', category: 'vegetable', level: 64, unit: 'pcs', amount: 7, caloriesPerUnit: 12, tone: 'green'  },
  { id: 's-carrot',     name: 'Havuç',      category: 'vegetable', level: 71, unit: 'pcs', amount: 8, caloriesPerUnit: 25, tone: 'orange' },
  { id: 's-beet',       name: 'Pancar',     category: 'vegetable', level: 55, unit: 'pcs', amount: 4, caloriesPerUnit: 35, tone: 'amber'  },
  { id: 's-cucumber',   name: 'Salatalık',  category: 'vegetable', level:  0, unit: 'pcs', amount: 0, caloriesPerUnit: 14, tone: 'green'  },
  { id: 's-spinach',    name: 'Ispanak',    category: 'vegetable', level:  0, unit: 'pcs', amount: 0, caloriesPerUnit: 18, tone: 'green'  },
  { id: 's-celery',     name: 'Kereviz',    category: 'vegetable', level:  0, unit: 'pcs', amount: 0, caloriesPerUnit:  8, tone: 'green'  },
  // --- Güçlendirici ---
  { id: 's-ginger',     name: 'Zencefil',   category: 'booster',   level: 30, unit: 'g',   amount: 60, caloriesPerUnit: 5, tone: 'amber' },
  { id: 's-mint',       name: 'Nane',       category: 'booster',   level: 52, unit: 'g',   amount: 40, caloriesPerUnit: 2, tone: 'green' },
];

export const helpTopics: HelpTopic[] = [
  {
    id: 'help-pair',
    title: 'Makinem görünmüyor',
    category: 'device',
    body: 'Telefonu iki metre içinde tut, Bluetooth’u aç ve JuiceLab Pro X1’i beş saniye kapatıp tekrar aç.',
  },
  {
    id: 'help-filter',
    title: 'Filtreyi ne zaman değiştirmeliyim?',
    category: 'device',
    body: 'FreshPress her servisten sonra filtre kullanımını izler. Bakım kartı limite ulaştığında filtreyi değiştir.',
  },
  {
    id: 'help-recipes',
    title: 'Tarif kalorileri nasıl hesaplanır?',
    category: 'recipes',
    body: 'Kaloriler yerel sahte katalogdaki seçili malzemelerden tahmin edilir ve sıkım bittiğinde kaydedilir.',
  },
  {
    id: 'help-account',
    title: 'Verilerim nerede saklanıyor?',
    category: 'account',
    body: 'Bu prototip tüm hesap, cihaz, tarif ve stok verisini cihaz üzerinde sahte durumda tutar. Ağ arka ucu kullanılmaz.',
  },
];

export function getStock(): StockItem[] {
  return stock.map((item) => ({ ...item }));
}

export function setStockAmount(id: string, amount: number): StockItem | null {
  const item = stock.find((entry) => entry.id === id);
  if (!item) return null;
  item.amount = Math.max(0, Math.round(amount));
  item.level = Math.min(100, Math.max(0, item.amount * (item.unit === 'g' ? 1 : 10)));
  return { ...item };
}

export function addCustomRecipe(input: CreateRecipeInput): Recipe {
  const seen = new Set<string>();
  const uniqueIds = input.ingredientIds.filter((id) => !seen.has(id) && seen.add(id));
  const selected = uniqueIds
    .map((id) => stock.find((item) => item.id === id))
    .filter((item): item is StockItem => Boolean(item));

  const calories = Math.max(
    40,
    selected.reduce((total, item) => {
      const amount = input.amounts?.[item.id] ?? 1;
      return total + item.caloriesPerUnit * amount;
    }, 0),
  );

  const recipe: Recipe = {
    id: `r-custom-${Date.now()}`,
    title: input.title.trim(),
    description: input.description.trim() || 'Kayıtlı stoğundan özel bir FreshPress karışımı.',
    category: 'Tarifim',
    tone: selected[0]?.tone ?? 'green',
    calories,
    durationSec: Math.max(55, selected.length * 22),
    ingredients: selected.map((item) => {
      const amount = input.amounts?.[item.id];
      return amount && amount > 1 ? `${item.name} (${amount})` : item.name;
    }),
    steps: ['Malzemeleri onayla', 'Hazneyi doldur', 'Orta hızda başlat', 'Hemen servis et'],
    benefits: ['Özel karışım', 'Stok uyumlu', 'Taze servis'],
    isCustom: true,
  };
  recipes.unshift(recipe);
  return { ...recipe };
}
