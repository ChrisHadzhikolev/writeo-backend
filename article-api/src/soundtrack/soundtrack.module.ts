import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Soundtrack } from '../database/entities/soundtrack.entity';
import { SoundtrackService } from './service/soundtrack.service';
import { SoundtrackController } from './controller/soundtrack.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Soundtrack])],
  providers: [SoundtrackService],
  controllers: [SoundtrackController],
  exports: [SoundtrackService],
})
export class SoundtrackModule {}
