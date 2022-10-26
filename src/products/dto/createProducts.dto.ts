import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateProductsDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    price: number
}