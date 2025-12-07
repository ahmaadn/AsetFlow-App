// Menggunakan 'declare namespace' untuk menggabungkan dengan namespace Express yang ada
declare namespace Express {
  // Menambahkan properti 'user' ke dalam interface Request
  export interface Request {
    user?: {
      name: string;
      id: string;
      email: string;
      emailVerified: boolean;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
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
