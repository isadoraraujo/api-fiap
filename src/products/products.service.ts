import { Injectable } from '@nestjs/common';
import { UpdateProductsDTO } from './dto/updateProducts.dto';

@Injectable()
export class ProductsService {
    async create(): Promise<string> {
        return 'Produto criado com sucesso!'
    }

    async findAll(): Promise<string> {
        return 'Lista de produtos!'
    }

    async findOne(id: number): Promise<string> {
        return `Produto ${id}`
    }

    async update(id: number, req: UpdateProductsDTO): Promise<string> {
        return 'Produto atualizado com sucesso!'
    }
}
