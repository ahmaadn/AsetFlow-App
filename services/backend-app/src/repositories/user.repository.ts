import { prisma, type UserRole, type UserModel } from '@asetflow/database';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

/**
 * User Repository Interface
 */
export interface IUserRepository {
  /**
   * Find user by email
   * @param email User's email
   * @returns UserModel or null if not found
   */
  findByEmail(email: string): Promise<UserModel | null>;

  /**
   * Create a new user
   * @param user User data
   */
  create(user: CreateUserDTO): Promise<UserModel>;

  /**
   * Update user's password
   * @param userId User's ID
   * @param newPassword New password string
   */
  updatePassword(userId: string, newPassword: string): Promise<void>;
}

/**
 * User Repository Implementation
 */
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

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }
}

export const userRepository = new UserRepository();
export default userRepository;
