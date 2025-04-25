import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriber } from './subscribers/user.subscriber';

@Module({
  imports: [TypeOrmModule],
  providers: [UserSubscriber],
  exports: [UserSubscriber],
})
export class DatabaseModule {}