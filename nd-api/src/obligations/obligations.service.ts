import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/company.entity';
import { Director } from '../directors/director.entity';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { UpdateObligationDto } from './dto/update-obligation.dto';
import { Obligation, ObligationStatus } from './obligation.entity';

@Injectable()
export class ObligationsService {
  constructor(
    @InjectRepository(Obligation)
    private readonly obligationsRepository: Repository<Obligation>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Director)
    private readonly directorsRepository: Repository<Director>,
  ) {}

  async create(dto: CreateObligationDto) {
    const company = await this.findCompanyOrFail(dto.companyId);
    const director = dto.directorId
      ? await this.findDirectorOrFail(dto.directorId)
      : null;

    const obligation = this.obligationsRepository.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      dueDate: new Date(dto.dueDate),
      status: dto.status ?? ObligationStatus.PENDING,
      company,
      director,
    });

    return this.obligationsRepository.save(obligation);
  }

  findAll() {
    return this.obligationsRepository.find({
      relations: ['company', 'director'],
      order: { dueDate: 'ASC' },
    });
  }

  async findOne(id: string) {
    const obligation = await this.obligationsRepository.findOne({
      where: { id },
      relations: ['company', 'director'],
    });
    if (!obligation) {
      throw new NotFoundException('Obligation not found');
    }
    return obligation;
  }

  async update(id: string, dto: UpdateObligationDto) {
    const obligation = await this.findOne(id);

    if (dto.companyId) {
      obligation.company = await this.findCompanyOrFail(dto.companyId);
    }

    if (dto.directorId === null) {
      obligation.director = null;
    } else if (dto.directorId) {
      obligation.director = await this.findDirectorOrFail(dto.directorId);
    }

    if (dto.title) obligation.title = dto.title;
    if (dto.description) obligation.description = dto.description;
    if (dto.category) obligation.category = dto.category;
    if (dto.dueDate) obligation.dueDate = new Date(dto.dueDate);
    if (dto.status) obligation.status = dto.status;

    return this.obligationsRepository.save(obligation);
  }

  async remove(id: string) {
    const obligation = await this.findOne(id);
    await this.obligationsRepository.remove(obligation);
    return { success: true };
  }

  private async findCompanyOrFail(id: string) {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  private async findDirectorOrFail(id: string) {
    const director = await this.directorsRepository.findOne({ where: { id } });
    if (!director) throw new NotFoundException('Director not found');
    return director;
  }
}

