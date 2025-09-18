import { CustomersService } from '../services/customers.service';
import { Customer } from '@prisma/client';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: string): Promise<Customer>;
    update(id: string, data: Partial<Customer>): Promise<Customer>;
    remove(id: string): Promise<Customer>;
}
