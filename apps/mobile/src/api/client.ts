/**
 * Local mock "API". Replaces the former fetch-based Flask client: every method
 * resolves against @freshpress/data with a simulated network delay. The exported
 * `api` shape and `RequestError` are preserved so AuthContext and the screens
 * keep working unchanged.
 *
 * Tokens are intentionally trivial — `accessToken`/`refreshToken` are just the
 * user id. `me(token)` looks the user up by id to restore the session.
 */
import type {
  ApiError,
  AuthResponse,
  CalorieDay,
  CreateRecipeInput,
  Device,
  DeviceDetails,
  HelpTopic,
  JuiceHistoryEntry,
  JuiceProgram,
  JuicingSession,
  Notification,
  Recipe,
  Recommendation,
  StockItem,
  User,
} from '@freshpress/types';
import {
  authenticate,
  addCustomRecipe,
  createRuntimeUser,
  findUserByEmail,
  findUserById,
  getCalories,
  getGoals,
  getDeviceDetails,
  getHelpTopics,
  getHistory,
  getNotifications,
  getRecipeById,
  getStock,
  juicingSession,
  programs as allPrograms,
  publicUser,
  recipes as allRecipes,
  recommendations as allRecommendations,
  setDeviceConnected,
  setDeviceSpeed,
  setStockAmount,
  updateUserProfile,
  getDevice,
} from '@freshpress/data';
import type { ExtractionSpeed, WeeklyGoals } from '@freshpress/types';
import { sleep } from '@freshpress/utils';

export class RequestError extends Error {
  status: number;
  fields?: Record<string, string>;
  code: string;

  constructor(payload: ApiError, status: number) {
    super(payload.message);
    this.code = payload.error;
    this.status = status;
    this.fields = payload.fields;
  }
}

const LATENCY = 400;

function tokensFor(user: User): AuthResponse {
  return { user, tokens: { accessToken: user.id, refreshToken: user.id } };
}

export const api = {
  async register(input: { name: string; email: string; password: string }): Promise<AuthResponse> {
    await sleep(LATENCY);
    if (findUserByEmail(input.email)) {
      throw new RequestError(
        {
          error: 'email_taken',
          message: 'That email is already registered.',
          fields: { email: 'This email is already in use.' },
        },
        409,
      );
    }
    const user = createRuntimeUser(input);
    return tokensFor(user);
  },

  async login(input: { email: string; password: string }): Promise<AuthResponse> {
    await sleep(LATENCY);
    const user = authenticate(input.email, input.password);
    if (!user) {
      throw new RequestError(
        { error: 'invalid_credentials', message: 'Incorrect email or password' },
        401,
      );
    }
    return tokensFor(user);
  },

  /** Mock "Sign in with Apple" — logs in as the demo predefined user. */
  async appleSignIn(): Promise<AuthResponse> {
    await sleep(LATENCY);
    const demo = findUserByEmail('demo@freshpress.app');
    if (!demo) {
      throw new RequestError(
        { error: 'apple_unavailable', message: 'Apple sign-in is unavailable.' },
        500,
      );
    }
    return tokensFor(publicUser(demo));
  },

  async me(token?: string): Promise<{ user: User }> {
    await sleep(LATENCY);
    const user = token ? findUserById(token) : null;
    if (!user) {
      throw new RequestError({ error: 'unauthorized', message: 'Session expired' }, 401);
    }
    return { user: publicUser(user) };
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    await sleep(LATENCY);
    return { accessToken: refreshToken };
  },

  async device(token: string): Promise<{ device: Device }> {
    await sleep(LATENCY);
    return { device: getDevice(token) };
  },

  async deviceDetails(token: string): Promise<{ details: DeviceDetails }> {
    await sleep(LATENCY);
    return { details: getDeviceDetails(token) };
  },

  async pairDevice(token: string, connected: boolean): Promise<{ device: Device }> {
    await sleep(LATENCY);
    return { device: setDeviceConnected(token, connected) };
  },

  async setSpeed(token: string, speed: ExtractionSpeed): Promise<{ device: Device }> {
    await sleep(LATENCY);
    return { device: setDeviceSpeed(token, speed) };
  },

  async updateProfile(
    token: string,
    input: { name?: string; email?: string },
  ): Promise<{ user: User }> {
    await sleep(LATENCY);
    const user = updateUserProfile(token, input);
    if (!user) {
      throw new RequestError({ error: 'unauthorized', message: 'Session expired' }, 401);
    }
    return { user };
  },

  async recipes(): Promise<{ recipes: Recipe[] }> {
    await sleep(LATENCY);
    return { recipes: [...allRecipes] };
  },

  async recipe(id: string): Promise<{ recipe: Recipe | null }> {
    await sleep(LATENCY);
    return { recipe: getRecipeById(id) };
  },

  async addRecipe(input: CreateRecipeInput): Promise<{ recipe: Recipe }> {
    await sleep(LATENCY);
    return { recipe: addCustomRecipe(input) };
  },

  async history(token: string): Promise<{ history: JuiceHistoryEntry[] }> {
    await sleep(LATENCY);
    return { history: getHistory(token) };
  },

  async goals(token: string): Promise<{ goals: WeeklyGoals }> {
    await sleep(LATENCY);
    return { goals: getGoals(token) };
  },

  async calories(token: string): Promise<{ today: number; days: CalorieDay[] }> {
    await sleep(LATENCY);
    return getCalories(token);
  },

  async notifications(token: string): Promise<{ notifications: Notification[] }> {
    await sleep(LATENCY);
    return { notifications: getNotifications(token) };
  },

  async programs(): Promise<{ programs: JuiceProgram[] }> {
    await sleep(LATENCY);
    return { programs: allPrograms };
  },

  async juicingSession(): Promise<{ session: JuicingSession }> {
    await sleep(LATENCY);
    return { session: juicingSession };
  },

  async stock(): Promise<{ stock: StockItem[] }> {
    await sleep(LATENCY);
    return { stock: getStock() };
  },

  async updateStockItem(id: string, amount: number): Promise<{ stock: StockItem[] }> {
    await sleep(LATENCY);
    setStockAmount(id, amount);
    return { stock: getStock() };
  },

  async recommendations(): Promise<{ recommendations: Recommendation[] }> {
    await sleep(LATENCY);
    return { recommendations: allRecommendations };
  },

  async helpTopics(): Promise<{ topics: HelpTopic[] }> {
    await sleep(LATENCY);
    return { topics: getHelpTopics() };
  },
};
