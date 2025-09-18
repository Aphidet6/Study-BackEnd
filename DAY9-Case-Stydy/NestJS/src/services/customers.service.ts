import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    return this.prisma.customer.create({
      data,
    });
  }

  async findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany();
  }

  async findOne(id: number): Promise<Customer> {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Customer> {
    return this.prisma.customer.delete({
      where: { id },
    });
  }
} 