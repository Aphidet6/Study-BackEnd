import { PrismaService } from '../prisma/prisma.service';
import { Customer } from '@prisma/client';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: number): Promise<Customer>;
    update(id: number, data: Partial<Customer>): Promise<Customer>;
    remove(id: number): Promise<Customer>;
}
