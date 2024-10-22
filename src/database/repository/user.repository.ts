import { Injectable } from '@nestjs/common';

import { User, UserProp } from 'src/shared/types/user.type';
import { BaseRepository } from './base.repository';
import { DbConnection } from '../db.connection';
import { AccountStatus, PrismaClient, Role } from '@prisma/client';
import { WordGenerator } from 'src/shared/util/word-generator.util';

@Injectable()
export class UserRepository extends BaseRepository<User, string, UserProp> {
  private db: DbConnection;

  constructor(private wordGenerator: WordGenerator) {
    super();
    this.db = DbConnection.getInstance();
  }

  protected selectProps(): UserProp {
    return {
      id: true,
      name: true,
      username: true,
      role: true,
      status: true,
    };
  }

  async add(entity: User): Promise<User> {
    const prisma = await this.db.open();

    const id = await this.getNextId(prisma, entity.role);

    const addedUser = await prisma.user.create({
      data: {
        id,
        name: entity.name,
        username: entity.username,
        password: entity.password!,
        role: entity.role,
      },
      select: this.selectProps(),
    });

    await this.db.close();

    return addedUser;
  }

  async getNextId(prisma: PrismaClient, preferredRole: Role) {
    const totalCount = await prisma.user.count({
      where: {
        role: preferredRole,
      },
    });

    const seed = 1000;
    const seedIncrement = 1;
    const initial = preferredRole === Role.ADMIN ? 'AD' : 'DIST';
    const suffixLength = 3;
    const suffix = this.wordGenerator.generator(suffixLength);

    return initial + (seed + seedIncrement + totalCount) + suffix;
  }

  async update(entity: User): Promise<User> {
    const prisma = await this.db.open();

    const user = await prisma.user.update({
      where: {
        id: entity.id,
      },
      data: {
        name: entity.name,
        username: entity.username,
        password: entity.password,
        status: entity.status,
      },
      select: this.selectProps(),
    });

    await this.db.close();

    return user;
  }

  async delete(entityId: string): Promise<void> {
    const prisma = await this.db.open();

    await prisma.user.update({
      where: {
        id: entityId,
      },
      data: {
        status: AccountStatus.SUSPENDED,
      },
    });

    await this.db.close();
  }

  async find(value: string): Promise<User> {
    const prisma = await this.db.open();

    const user = await prisma.user.findFirst({
      where: {
        id: value,
      },
    });

    await this.db.close();

    return user;
  }
}
