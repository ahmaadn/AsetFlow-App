import {
  prisma,
  VerificationModel,
  VerificationType,
} from '@asetflow/database';

interface CreateVerificationDTO {
  email: string;
  userId: string;
  token: string;
  type: VerificationType;
  expiresAt: Date;
}

/**
 * Verification Repository Interface
 */
export interface IVerificationRepository {
  /**
   * Find verification by token
   * @param token Verification token string
   */
  findByToken(token: string): Promise<VerificationModel | null>;
  /**
   * Create a new verification record
   * @param verification Data for the new verification
   */
  create(verification: CreateVerificationDTO): Promise<VerificationModel>;
  /**
   * Revoke a verification token
   * @param token Verification token string
   */
  revoke(token: string): Promise<void>;
  /**
   * Check if a verification token has been used
   * @param token Verification token string
   */
  isTokenUsed(token: string): Promise<boolean>;
}

/**
 * Verification Repository Implementation
 */
export class VerificationRepository implements IVerificationRepository {
  async findByToken(token: string): Promise<VerificationModel | null> {
    // Implementation to find verification by token
    return await prisma.verification.findUnique({
      where: { token },
    });
  }

  async create(
    verification: CreateVerificationDTO
  ): Promise<VerificationModel> {
    return await prisma.verification.create({
      data: {
        email: verification.email,
        userId: verification.userId,
        token: verification.token,
        type: verification.type,
        expiresAt: verification.expiresAt,
      },
    });
  }

  async revoke(token: string): Promise<void> {
    await prisma.verification.update({
      where: {
        token,
      },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });
  }

  async isTokenUsed(token: string): Promise<boolean> {
    const verification = await prisma.verification.findUnique({
      where: { token },
      select: { isUsed: true },
    });
    return verification ? verification.isUsed : false;
  }
}
export const verificationRepository = new VerificationRepository();
export default verificationRepository;
