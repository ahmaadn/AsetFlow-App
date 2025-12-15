import { prisma, type UserRole, type UserModel } from '@asetflow/database';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface IUserRepository {
  /**
   * Find user by email
   * @param email User's email
   * @returns UserModel or null if not found
   */
  findByEmail(email: string): Promise<UserModel | null>;

  create(user: CreateUserDTO): Promise<UserModel>;
}

class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserModel | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(user: CreateUserDTO): Promise<UserModel> {
    return await prisma.user.create({
      data: {
        name: user.name!,
        email: user.email!,
        password: user.password!,
        role: user.role || 'USER',
      },
    });
  }
}

export const userRepository = new UserRepository();
