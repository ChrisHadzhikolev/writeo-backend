import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsOptional } from 'class-validator';
import { Article } from './article.entity';

@Entity()
export class Soundtrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  authorId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  category: string;

  @IsOptional()
  @ManyToOne(() => Article)
  @JoinColumn()
  article: Article;

  @Column()
  isPrivate: boolean;
}
