import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common"
import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Product } from "./entities/product.entity"
import { PaginationDto } from "src/common/dtos/pagination.dto"
import { isUUID } from "class-validator"

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(`ProductsService`)

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product)

      return product
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
    })

    if (products.length === 0)
      throw new NotFoundException(`There's no items to show`)

    return products
  }

  async findOne(term: string) {
    let product: Product

    if (isUUID(term))
      product = await this.productRepository.findOneBy({ id: term })
    else product = await this.productRepository.findOneBy({ slug: term })
    // const product = await this.productRepository.findOneBy({ id: term })

    if (!product)
      throw new NotFoundException(`Product with term ${term} not found`)

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    })

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`)

    try {
      await this.productRepository.save(product)
      return product
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async remove(id: string) {
    const product = await this.productRepository.delete({ id })

    if (product.affected === 0)
      throw new NotFoundException(
        `Cannot delete product with id ${id} cause not exists`,
      )

    return { message: `Product with id ${id} was succesfully deleted` }
  }

  private handleDBExceptions(error: any) {
    console.error(error)
    if (error.code === `23505`) throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException(
      `Unexpected error, check logs for more info`,
    )
  }
}
