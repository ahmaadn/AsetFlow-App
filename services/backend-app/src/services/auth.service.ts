import { AuthTokens } from '@asetflow/shared-types';
import * as jwt from 'jsonwebtoken';

import * as userRepository from '../repositories/user.repository';
import { BadRequestError, FieldValidationError } from '../utils/api-error';
import { ErrorCode } from '../utils/error-code';
import logger from '../utils/logger';
import * as Password from '../utils/password-helper';
import { comparePassword } from '../utils/password-helper';
import { isValidEmail } from '../utils/validators';

/**
 * Membuat pengguna baru menggunakan metode register.
 * @param data Data pengguna baru.
 * @returns Pengguna yang dibuat.
 */
export const createUser = async (data: {
  email: string;
  name: string;
  password: string;
}) => {
  logger.info('Membuat pengguna baru dengan email: %s', data.email);

  // Cek apakah email valid
  if (isValidEmail(data.email) === false) {
    throw new FieldValidationError({
      message: 'Invalid email format or length exceeds 100 characters',
      details: {
        'body.email': {
          message: 'Invalid email format or length exceeds 100 characters',
          value: data.email,
        },
      },
    });
  }

  const excitingUser = await userRepository.findByEmail(data.email);
  if (excitingUser) {
    throw new BadRequestError({
      message: 'Email already in use',
      errorCode: ErrorCode.USER_EMAIL_ALREADY_IN_USE,
    });
  }

  const user = await userRepository.createUser({
    email: data.email,
    name: data.name,
    passwordHash: await Password.hashPassword(data.password),
  });

  logger.info(`User registered with email: ${user.email}`);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthTokens> => {
  logger.info(`User login attempt with email: ${data.email}`);

  // cek apakah email valid
  const user = await userRepository.findByEmail(data.email);
  if (!user) {
    throw new BadRequestError({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await comparePassword(
    data.password,
    user.passwordHash
  );
  if (!isPasswordValid) {
    throw new BadRequestError({ message: 'Invalid email or password' });
  }

  // buat payload untuk JWT
  const payload = {
    sub: user.id,
    email: user.email,
  };

  // @ts-expect-error JWT_SECRET dijamin ada karena sudah di cek di awal aplikasi
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    audience: 'asetflow',
  });

  logger.info(`User logged in with email: ${data.email}`);
  return { accessToken, tokenType: 'Bearer' };
};
