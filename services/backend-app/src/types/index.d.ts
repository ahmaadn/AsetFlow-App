// Menggunakan 'declare namespace' untuk menggabungkan dengan namespace Express yang ada
declare namespace Express {
  // Menambahkan properti 'user' ke dalam interface Request
  export interface Request {
    user?: {
      id: number;
      name: string;
      email: string;
      passwordHash: string;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
    };
  }
}
