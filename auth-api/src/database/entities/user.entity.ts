import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../authentication/enum/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: true })
  password: string;

  @Column()
  role: Role;
}
