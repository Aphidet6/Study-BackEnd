import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { Customer } from '@prisma/client';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    return this.customersService.create(data);
  }

  @Get()
  async findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    const customer = await this.customersService.findOne(Number(id));
    if (!customer) {
      throw new HttpException('ไม่พบลูกค้า', HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Customer>): Promise<Customer> {
    try {
      return await this.customersService.update(Number(id), data);
    } catch (error) {
      throw new HttpException('ไม่พบลูกค้า', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Customer> {
    try {
      return await this.customersService.remove(Number(id));
    } catch (error) {
      throw new HttpException('ไม่พบลูกค้า', HttpStatus.NOT_FOUND);
    }
  }
} 