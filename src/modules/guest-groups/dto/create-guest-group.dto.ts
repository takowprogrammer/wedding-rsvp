import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGuestGroupDto {
    @IsNotEmpty()
    @IsString()
    name: string;
} 