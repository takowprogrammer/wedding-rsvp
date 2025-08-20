import { IsEmail, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';

export class CreateGuestDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(10)
    numberOfGuests: number;

    @IsOptional()
    @IsString()
    dietaryRestrictions?: string;

    @IsOptional()
    @IsString()
    specialRequests?: string;

    @IsOptional()
    @IsString()
    groupId?: string;

    @IsNotEmpty() // Mark phone as required
    @IsString()
    phone: string;
}