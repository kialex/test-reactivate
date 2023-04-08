export interface SessionDataInterface {
  id: string;
  blockedTime: number | null;
  lastUnlockedTime: number | null;
  user: { uuid: string; ipAddress: string; userAgent: string; email: string };
}
