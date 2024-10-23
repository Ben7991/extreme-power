import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcryptjs';

import { Role } from '@prisma/client';
import { UserRepository } from 'src/database/repository/user.repository';

@Injectable()
export class SeederService {
  constructor(
    private userRepo: UserRepository,
    private configService: ConfigService,
  ) {}

  async createAdmin() {
    const adminDetails = this.configService.get<{
      name: string;
      username: string;
      password: string;
    }>('admin');

    try {
      const existingAdmin = await this.userRepo.find(adminDetails.username);

      if (existingAdmin) {
        throw new Error('Admin already exist');
      }

      const hashedPassword = await hash(adminDetails.password, 12);
      await this.userRepo.add({
        ...adminDetails,
        password: hashedPassword,
        role: Role.ADMIN,
      });

      return { message: 'Admin successfully created' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Something went wrong');
    }
  }
}
