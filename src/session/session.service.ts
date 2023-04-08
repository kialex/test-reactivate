import * as crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { SESSION_STORE_SERVICE, SessionStoreInterface } from './session-store.interface';
import { SessionDataInterface } from './interfaces/session-data.interface';
import { SessionConfigService } from './session-config.service';

export const buildKey = (key: string | number) => `session:auth:${key}`;

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_STORE_SERVICE)
    private readonly store: SessionStoreInterface,
    private readonly config: SessionConfigService,
  ) {}

  /**
   * @param {string} id
   */
  get(id: string): Promise<SessionDataInterface | null> {
    return this.store.get(buildKey(id)).then(result => JSON.parse(result));
  }

  /**
   * @param {Omit<SessionDataInterface, 'id'>} value
   */
  async set(
    value: Omit<SessionDataInterface, 'id' | 'lastUnlockedTime' | 'blockedTime'>,
  ): Promise<string> {
    const id = crypto.randomUUID();
    const defaultValue = {
      id,
      lastUnlockedTime: Math.round(Date.now() / 1000),
      blockedTime: null,
    };

    return this.store
      .set(buildKey(id), JSON.stringify({ ...defaultValue, ...value }), this.config.lifetime)
      .then(() => id);
  }

  /**
   * @param {string} id
   * @param {Partial<SessionDataInterface>} value
   */
  regenerate(id: string, value: Partial<SessionDataInterface>): Promise<boolean> {
    return this.get(id).then(originalValue =>
      this.store.update(buildKey(id), JSON.stringify({ ...originalValue, ...value })),
    );
  }
}
