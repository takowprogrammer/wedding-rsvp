import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

// DTO for creating invitations with isActive field support
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

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}