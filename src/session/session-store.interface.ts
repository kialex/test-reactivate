export interface SessionStoreInterface {
  set(id: string, value: string, lifetime?: number): Promise<boolean>;

  get(id: string): Promise<string>;

  destroy(id: string): Promise<void>;

  update(id: string, value: string): Promise<boolean>;
}

export const SESSION_STORE_SERVICE = Symbol('SessionStoreInterface');
