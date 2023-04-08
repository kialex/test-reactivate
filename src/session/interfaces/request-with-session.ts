import { SessionDataInterface } from './session-data.interface';

export type RequestWithSession<T> = T & {
  session?: SessionDataInterface | null | undefined;
};
