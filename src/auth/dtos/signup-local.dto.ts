import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';


export class SignUpLocalDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @MinLength(5)
    @MaxLength(50)
    @Transform(({ value }: TransformFnParams) => value?.toLowerCase().trim())
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(30)
    @Transform(({ value }: TransformFnParams) => value?.toLowerCase().trim())
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(30)
    @Transform(({ value }: TransformFnParams) => value?.toLowerCase().trim())
    lastName: string;
}