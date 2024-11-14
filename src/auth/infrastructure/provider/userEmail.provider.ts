import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { DataSource, In } from 'typeorm';

@Injectable()
export class UserEmailProvider {
  private readonly userRepo: UserRepository;
  constructor(@Inject('BaseDeDatos') private readonly dataSource: DataSource) {
    this.userRepo = new UserRepository(this.dataSource);
  }

  async getEmails(): Promise<string[]> {
    return await this.userRepo.getAllEmails();
  }
}
