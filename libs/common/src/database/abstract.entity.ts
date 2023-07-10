import { Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export abstract class AbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
