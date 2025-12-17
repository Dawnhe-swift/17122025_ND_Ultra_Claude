import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Director } from '../directors/director.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Director)
    private readonly directorsRepository: Repository<Director>,
  ) {}

  async create(dto: CreateCompanyDto) {
    const company = this.companiesRepository.create({
      name: dto.name,
      uen: dto.uen,
      sector: dto.sector,
    });

    if (dto.nomineeDirectorId) {
      company.nomineeDirector = await this.findDirectorOrFail(dto.nomineeDirectorId);
    }

    return this.companiesRepository.save(company);
  }

  findAll() {
    return this.companiesRepository.find({
      relations: ['nomineeDirector', 'obligations', 'obligations.director'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['nomineeDirector', 'obligations', 'obligations.director'],
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(id: string, dto: UpdateCompanyDto) {
    const company = await this.findOne(id);

    if (dto.nomineeDirectorId === null) {
      company.nomineeDirector = null;
    } else if (dto.nomineeDirectorId) {
      company.nomineeDirector = await this.findDirectorOrFail(dto.nomineeDirectorId);
    }

    if (dto.name) company.name = dto.name;
    if (dto.uen) company.uen = dto.uen;
    if (dto.sector) company.sector = dto.sector;

    return this.companiesRepository.save(company);
  }

  async remove(id: string) {
    const company = await this.findOne(id);
    await this.companiesRepository.remove(company);
    return { success: true };
  }

  private async findDirectorOrFail(id: string) {
    const director = await this.directorsRepository.findOne({ where: { id } });
    if (!director) {
      throw new NotFoundException('Nominee director not found');
    }
    return director;
  }
}

