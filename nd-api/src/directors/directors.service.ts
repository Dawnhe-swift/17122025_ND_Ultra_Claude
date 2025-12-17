import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Director } from './director.entity';

@Injectable()
export class DirectorsService {
  constructor(
    @InjectRepository(Director)
    private readonly directorsRepository: Repository<Director>,
  ) {}

  create(dto: CreateDirectorDto) {
    const director = this.directorsRepository.create(dto);
    return this.directorsRepository.save(director);
  }

  findAll() {
    return this.directorsRepository.find({
      relations: ['companies', 'obligations'],
      order: { fullName: 'ASC' },
    });
  }

  async findOne(id: string) {
    const director = await this.directorsRepository.findOne({
      where: { id },
      relations: ['companies', 'obligations'],
    });
    if (!director) {
      throw new NotFoundException('Nominee director not found');
    }
    return director;
  }

  async update(id: string, dto: UpdateDirectorDto) {
    const director = await this.findOne(id);
    if (dto.fullName) director.fullName = dto.fullName;
    if (dto.email) director.email = dto.email;
    if (dto.phone) director.phone = dto.phone;

    return this.directorsRepository.save(director);
  }

  async remove(id: string) {
    const director = await this.findOne(id);
    await this.directorsRepository.remove(director);
    return { success: true };
  }
}

