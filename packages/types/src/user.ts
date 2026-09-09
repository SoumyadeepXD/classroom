export type SystemRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export type PresenceStatus = 'ONLINE' | 'IDLE' | 'IN_CLASS' | 'DO_NOT_DISTURB' | 'OFFLINE';

export interface User {
  id: string;
  institutionId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  systemRole: SystemRole;
  mfaEnabled: boolean;
  pronouns?: string;
  bio?: string;
  timezone?: string;
  presenceStatus?: PresenceStatus;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: Pick<User, 'id' | 'email' | 'displayName' | 'systemRole'>;
}
