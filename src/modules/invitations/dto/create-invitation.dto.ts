import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInvitationDto {
    @IsNotEmpty()
    templateName: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    message: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNotEmpty()
    buttonText: string;

    @IsOptional()
    @IsString()
    formUrl?: string;
}