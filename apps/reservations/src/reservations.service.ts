import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private resRepo: Repository<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    const reservation = this.resRepo.create({
      ...createReservationDto,
      userId,
    });
    await this.resRepo.save(reservation);
    return reservation;
  }

  findAll() {
    return this.resRepo.find();
  }

  async findOne(id: string) {
    const res = await this.resRepo.findOneBy({ id });
    if (!res) {
      throw new NotFoundException('Reservation not found');
    }
    return res;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const reservation = this.findOne(id);

    return await this.resRepo.save({
      ...reservation,
      ...updateReservationDto,
      userId: '123',
    });
  }

  async remove(id: string) {
    const res = await this.resRepo.delete({ id });
    if (res.affected === 0) {
      throw new NotFoundException();
    }
    return res;
  }
}
