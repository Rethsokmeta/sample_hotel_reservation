import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Reservation extends AbstractEntity {
  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  timestamp: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  userId: string;

  @Column()
  placeId: string;

  @Column()
  invoiceId: string;
}
