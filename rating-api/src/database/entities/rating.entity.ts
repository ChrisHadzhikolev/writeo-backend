import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  articleId: string;

  @Column({ default: 0 })
  rating: number;

  // @Column({ default: 0 })
  // fromUsers: number;

  @Column()
  user: string;
}
