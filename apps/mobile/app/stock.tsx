import { Redirect } from 'expo-router';

import { appRoute } from '../src/lib/route';

export default function StockRedirect() {
  return <Redirect href={appRoute('/(tabs)/stock')} />;
}
