import { prisma, RefreshTokenModel, UserRole } from '@asetflow/database';
import { type RefreshTokenPayload } from '@asetflow/shared';

interface CreateRefteshTokenDTO {
  userId: string;
  token: string;
  expiresAt: Date;
  userAgent?: string;
}

interface UpdateRefreshTokenDTO {
  tokenId: string;
  token: string;
  expiresAt: Date;
}

interface RefreshTokenQuery extends RefreshTokenModel {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

/**
 * Refresh Token Repository Interface
 */
export interface IRefreshTokenRepository {
  /**
   * Create a new refresh token
   * @param data data for the new refresh token
   */
  create(data: CreateRefteshTokenDTO): Promise<RefreshTokenModel>;

  /**
   * Update a refresh token
   * @param data data for updating the refresh token
   */
  update(data: UpdateRefreshTokenDTO): Promise<RefreshTokenModel>;

  /**
   * Find an active refresh token by payload and token
   * @param payload Refresh token payload
   * @param token Refresh token string
   */
  findActiveByToken(
    payload: RefreshTokenPayload,
    token: string
  ): Promise<RefreshTokenQuery | null>;

  /**
   * Revoke a refresh token
   * @param payload Refresh token payload
   * @param token Refresh token string
   */
  revokeToken(payload: RefreshTokenPayload, token: string): Promise<void>;
}

/**
 * Refresh Token Repository Implementation
 */
export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(data: CreateRefteshTokenDTO): Promise<RefreshTokenModel> {
    return await prisma.refreshToken.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt,
        userAgent: data.userAgent,
      },
    });
  }
  async update(data: UpdateRefreshTokenDTO): Promise<RefreshTokenModel> {
    return await prisma.refreshToken.update({
      where: { id: data.tokenId },
      data: {
        token: data.token,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findActiveByToken(
    payload: RefreshTokenPayload,
    token: string
  ): Promise<RefreshTokenQuery | null> {
    return await prisma.refreshToken.findFirst({
      where: {
        id: payload.tokenId,
        userId: payload.userId,
        token,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async revokeToken(
    payload: RefreshTokenPayload,
    token: string
  ): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        id: payload.tokenId,
        userId: payload.userId,
        token,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
export default refreshTokenRepository;
