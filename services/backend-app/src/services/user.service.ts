import { UserInfoResponses } from '@asetflow/shared-types';

import { type IUserRepository } from '../repositories/user.repository';

export class UserService {
  private userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Get current user info
   * @param userId User's ID
   * @returns User info response or null if not found
   */
  async me(userId: string): Promise<UserInfoResponses | null> {
    const user = await this.userRepository.userInfo(userId);

    // TODO: Handle null case properly, this case
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
