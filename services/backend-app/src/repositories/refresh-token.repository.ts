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

export interface IRefreshTokenRepository {
  create(data: CreateRefteshTokenDTO): Promise<RefreshTokenModel>;
  update(data: UpdateRefreshTokenDTO): Promise<RefreshTokenModel>;
  findActiveByToken(
    payload: RefreshTokenPayload,
    token: string
  ): Promise<RefreshTokenQuery | null>;

  revokeToken(payload: RefreshTokenPayload, token: string): Promise<void>;
}

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
