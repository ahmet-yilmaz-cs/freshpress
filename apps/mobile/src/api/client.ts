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
  Device,
  JuiceHistoryEntry,
  JuiceProgram,
  Notification,
  Recipe,
  Recommendation,
  StockItem,
  User,
} from '@freshpress/types';
import {
  authenticate,
  createRuntimeUser,
  findUserByEmail,
  findUserById,
  getCalories,
  getGoals,
  getHistory,
  getNotifications,
  programs as allPrograms,
  publicUser,
  recipes as allRecipes,
  recommendations as allRecommendations,
  setDeviceConnected,
  getDevice,
  stock as allStock,
} from '@freshpress/data';
import type { WeeklyGoals } from '@freshpress/types';
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

  async pairDevice(token: string, connected: boolean): Promise<{ device: Device }> {
    await sleep(LATENCY);
    return { device: setDeviceConnected(token, connected) };
  },

  async recipes(): Promise<{ recipes: Recipe[] }> {
    await sleep(LATENCY);
    return { recipes: allRecipes };
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

  async stock(): Promise<{ stock: StockItem[] }> {
    await sleep(LATENCY);
    return { stock: allStock };
  },

  async recommendations(): Promise<{ recommendations: Recommendation[] }> {
    await sleep(LATENCY);
    return { recommendations: allRecommendations };
  },
};
