export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
}

export interface SimpleUser {
  id: string;
  email: string;
  role: string;
}
