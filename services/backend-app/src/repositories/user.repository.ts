import { prisma, type UserRole, type UserModel } from '@asetflow/database';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

type UserCountByRoleQuery = {
  [K in UserRole]: number;
};

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

  /**
   * Count total users
   * @returns Number of users
   */
  userCount(): Promise<UserCountByRoleQuery>;

  /**
   * Get user info by ID
   * @param userId User's ID
   */
  userInfo(userId: string): Promise<UserModel | null>;
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

  async userCount(): Promise<UserCountByRoleQuery> {
    return await prisma.user
      .groupBy({
        by: ['role'],
        _count: {
          role: true,
        },
      })
      .then((results) => {
        const countByRole: UserCountByRoleQuery = {
          ADMIN: 0,
          USER: 0,
        };
        results.forEach((result) => {
          countByRole[result.role] = result._count.role;
        });
        return countByRole;
      });
  }

  async userInfo(userId: string): Promise<UserModel | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }
}

export const userRepository = new UserRepository();
export default userRepository;
