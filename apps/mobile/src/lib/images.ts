/**
 * Central registry for bundled photography. Keeping `require()` calls in one place
 * means screens import a typed reference instead of sprinkling asset paths around.
 */
export const images = {
  /** Wide kitchen scene with the juicer — full-bleed onboarding hero. */
  heroJuicer: require('../../assets/hero-juicer.jpg'),
  /** Fresh fruit bowl — recipes / explore / "fresh" hero. */
  heroFruits: require('../../assets/hero-fruits.jpg'),
  /** Square crop tightly framing the juicer — device tiles (home, pairing, info). */
  device: require('../../assets/device.jpg'),
  /** Finished glass of juice — the "your drink is ready" hero. */
  readyDrink: require('../../assets/ready-drink.jpg'),
} as const;

export type ImageKey = keyof typeof images;
