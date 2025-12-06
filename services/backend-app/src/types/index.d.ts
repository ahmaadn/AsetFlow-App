// Menggunakan 'declare namespace' untuk menggabungkan dengan namespace Express yang ada
declare namespace Express {
  // Menambahkan properti 'user' ke dalam interface Request
  export interface Request {
    user?: {
      // id: number;
      // name: string;
      // email: string;
      // passwordHash: string;
      // createdAt: Date;
      // updatedAt: Date;
      // deletedAt: Date | null;

      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined | undefined;
    };

    session?: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined | undefined;
      userAgent?: string | null | undefined | undefined;
    };
  }
}
