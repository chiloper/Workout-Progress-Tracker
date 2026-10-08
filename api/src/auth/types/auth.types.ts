export interface JwtPayLoad {
  sub: string;
  email: string;
}

export interface PublicUser {
  id: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
  user: PublicUser;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
}
