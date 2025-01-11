import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/database';
import { CreateProductRequest } from '@repo/types';

@Injectable()
export class ProductsService {
  async createProduct(data: CreateProductRequest) {
    // Use prisma client
    const product = await prisma.game.create({
      data: {
        name: data.name,
        // ... other fields
      },
    });
    return product;
  }
  async getProducts() {
    return prisma.game.findMany();
  }
}
