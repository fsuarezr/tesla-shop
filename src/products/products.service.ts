import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"

import { isUUID } from "class-validator"

import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { PaginationDto } from "src/common/dtos/pagination.dto"

import { Product, ProductImage } from "./entities"

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(`ProductsService`)

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      })
      await this.productRepository.save(product)

      return { ...product, images }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    })

    if (products.length === 0)
      throw new NotFoundException(`There's no items to show`)

    return products.map(({ images, ...restProducts }) => ({
      ...restProducts,
      images: images.map((img) => img.url),
    }))
  }

  async findOne(term: string) {
    let product: Product

    if (isUUID(term))
      product = await this.productRepository.findOneBy({ id: term })
    else product = await this.productRepository.findOneBy({ slug: term })
    // const product = await this.productRepository.findOneBy({ id: term })

    if (!product)
      throw new NotFoundException(`Product with term ${term} not found`)

    return { ...product, images: product.images.map((img) => img.url) }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto

    const product = await this.productRepository.preload({ id, ...toUpdate })

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`)

    // Creando query runner
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } })

        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        )
      } else {
        product.images = await this.productImageRepository.findBy({
          product: { id },
        })
      }

      await queryRunner.manager.save(product)

      await queryRunner.commitTransaction()

      await queryRunner.release()

      return { ...product, images: product.images.map((img) => img.url) }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()

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

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder(`product`)

    try {
      return await query.delete().where({}).execute()
    } catch (error) {
      this.handleDBExceptions(error)
    }
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
