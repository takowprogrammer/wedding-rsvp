import { Controller, Get, Post, Body, Param, Res, HttpException, HttpStatus, Delete, Logger, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';

@Controller('invitations')
export class InvitationsController {
    private readonly logger = new Logger(InvitationsController.name);

    constructor(private readonly invitationsService: InvitationsService) { }

    @Post()
    async create(@Body() createInvitationDto: CreateInvitationDto) {
        this.logger.log(`Received invitation creation request: ${createInvitationDto.title}`);
        this.logger.debug('Invitation data:', JSON.stringify(createInvitationDto, null, 2));

        try {
            const result = await this.invitationsService.create(createInvitationDto);
            this.logger.log(`Invitation created successfully: ${result.id}`);
            return result;
        } catch (error) {
            this.logger.error('Failed to create invitation:', error);
            throw error;
        }
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                try {
                    // Save to frontend public/invitations directory
                    const frontendPath = path.join(process.cwd(), '..', 'rsvp-fe', 'frontend', 'public', 'invitations');
                    const backendPath = path.join(process.cwd(), 'public', 'invitations');

                    console.log(`Attempting to save file to frontend path: ${frontendPath}`);
                    console.log(`Frontend path exists: ${fs.existsSync(frontendPath)}`);
                    console.log(`Backend path exists: ${fs.existsSync(backendPath)}`);

                    // Try frontend path first, then backend path
                    if (fs.existsSync(frontendPath)) {
                        console.log(`Using frontend path: ${frontendPath}`);
                        cb(null, frontendPath);
                    } else if (fs.existsSync(backendPath)) {
                        console.log(`Using backend path: ${backendPath}`);
                        cb(null, backendPath);
                    } else {
                        // Create the directory if it doesn't exist
                        console.log(`Creating frontend directory: ${frontendPath}`);
                        fs.mkdirSync(frontendPath, { recursive: true });
                        cb(null, frontendPath);
                    }
                } catch (error) {
                    console.error('Error setting upload destination:', error);
                    cb(error, '');
                }
            },
            filename: (req, file, cb) => {
                try {
                    // Generate unique filename with timestamp
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const ext = path.extname(file.originalname);
                    const name = path.basename(file.originalname, ext);
                    const filename = `${name}-${uniqueSuffix}${ext}`;
                    console.log(`Generated filename: ${filename}`);
                    cb(null, filename);
                } catch (error) {
                    console.error('Error generating filename:', error);
                    cb(error, '');
                }
            }
        }),
        fileFilter: (req, file, cb) => {
            console.log(`File upload attempt: ${file.originalname}, mimetype: ${file.mimetype}`);
            // Accept only image files
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                console.log(`File accepted: ${file.originalname}`);
                cb(null, true);
            } else {
                console.log(`File rejected: ${file.originalname} (invalid mimetype: ${file.mimetype})`);
                cb(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
            }
        },
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB limit
        }
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        this.logger.log(`Received file upload: ${file?.originalname || 'undefined'}`);

        if (!file) {
            this.logger.error('No file uploaded');
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }

        try {
            // Return the file information
            const fileUrl = `/invitations/${file.filename}`;
            this.logger.log(`File uploaded successfully: ${file.filename} -> ${fileUrl}`);
            return {
                message: 'File uploaded successfully',
                filename: file.filename,
                originalName: file.originalname,
                url: fileUrl,
                size: file.size,
                mimetype: file.mimetype
            };
        } catch (error) {
            this.logger.error('Failed to upload file:', error);
            throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.invitationsService.remove(id);
    }

    @Delete('template/:filename')
    async deleteTemplate(@Param('filename') filename: string) {
        this.logger.log(`Attempting to delete template: ${filename}`);

        const frontendDir = path.join(process.cwd(), '..', 'rsvp-fe', 'frontend', 'public', 'invitations');
        const backendDir = path.join(process.cwd(), 'public', 'invitations');

        let deletedFrom = [];
        let errors = [];

        // Try to delete from frontend directory
        const frontendFilePath = path.join(frontendDir, filename);
        if (fs.existsSync(frontendFilePath)) {
            try {
                fs.unlinkSync(frontendFilePath);
                deletedFrom.push('frontend');
                this.logger.log(`Deleted ${filename} from frontend directory`);
            } catch (error) {
                errors.push(`Failed to delete from frontend: ${error.message}`);
                this.logger.error(`Failed to delete ${filename} from frontend:`, error);
            }
        }

        // Try to delete from backend directory
        const backendFilePath = path.join(backendDir, filename);
        if (fs.existsSync(backendFilePath)) {
            try {
                fs.unlinkSync(backendFilePath);
                deletedFrom.push('backend');
                this.logger.log(`Deleted ${filename} from backend directory`);
            } catch (error) {
                errors.push(`Failed to delete from backend: ${error.message}`);
                this.logger.error(`Failed to delete ${filename} from backend:`, error);
            }
        }

        if (deletedFrom.length === 0) {
            throw new HttpException(`Template file ${filename} not found`, HttpStatus.NOT_FOUND);
        }

        return {
            message: `Template ${filename} deleted successfully`,
            deletedFrom,
            errors: errors.length > 0 ? errors : undefined
        };
    }

    @Get()
    async findAll() {
        return await this.invitationsService.findAll();
    }

    @Get('active')
    async findActive() {
        return await this.invitationsService.findActive();
    }

    @Get('templates')
    async listTemplates() {
        const frontendDir = path.join(process.cwd(), '..', 'rsvp-fe', 'frontend', 'public', 'invitations');
        const backendDir = path.join(process.cwd(), 'public', 'invitations');

        this.logger.log('Scanning for invitation templates...');
        this.logger.log(`Frontend dir: ${frontendDir} (exists: ${fs.existsSync(frontendDir)})`);
        this.logger.log(`Backend dir: ${backendDir} (exists: ${fs.existsSync(backendDir)})`);

        // Ensure frontend directory exists
        if (!fs.existsSync(frontendDir)) {
            fs.mkdirSync(frontendDir, { recursive: true });
        }

        const allFiles: any[] = [];

        // First, scan frontend directory
        try {
            if (fs.existsSync(frontendDir)) {
                this.logger.log(`Reading frontend directory: ${frontendDir}`);
                const files = fs.readdirSync(frontendDir).filter(f =>
                    f.toLowerCase().match(/\.(png|jpg|jpeg|gif|webp)$/)
                );

                this.logger.log(`Found ${files.length} image files in frontend:`, files);

                files.forEach(f => {
                    const filePath = path.join(frontendDir, f);
                    const stats = fs.statSync(filePath);

                    allFiles.push({
                        file: f,
                        templateName: path.parse(f).name,
                        imageUrl: `/invitations/${f}`,
                        displayName: path.parse(f).name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        size: stats.size,
                        uploadedAt: stats.mtime,
                        isUploaded: f.includes('-') && /^\d+-\d+/.test(f)
                    });
                });
            }
        } catch (error) {
            this.logger.warn(`Could not read frontend directory:`, error);
        }

        // Then, scan backend directory and copy missing files to frontend
        try {
            if (fs.existsSync(backendDir)) {
                this.logger.log(`Reading backend directory: ${backendDir}`);
                const files = fs.readdirSync(backendDir).filter(f =>
                    f.toLowerCase().match(/\.(png|jpg|jpeg|gif|webp)$/)
                );

                this.logger.log(`Found ${files.length} image files in backend:`, files);

                files.forEach(f => {
                    const backendFilePath = path.join(backendDir, f);
                    const frontendFilePath = path.join(frontendDir, f);
                    const stats = fs.statSync(backendFilePath);

                    // Copy file to frontend if it doesn't exist there
                    if (!fs.existsSync(frontendFilePath)) {
                        try {
                            fs.copyFileSync(backendFilePath, frontendFilePath);
                            this.logger.log(`Copied ${f} from backend to frontend`);
                        } catch (copyError) {
                            this.logger.warn(`Failed to copy ${f} to frontend:`, copyError);
                        }
                    }

                    // Only add to list if not already added from frontend directory
                    if (!allFiles.some(existing => existing.file === f)) {
                        allFiles.push({
                            file: f,
                            templateName: path.parse(f).name,
                            imageUrl: `/invitations/${f}`,
                            displayName: path.parse(f).name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                            size: stats.size,
                            uploadedAt: stats.mtime,
                            isUploaded: f.includes('-') && /^\d+-\d+/.test(f)
                        });
                    }
                });
            }
        } catch (error) {
            this.logger.warn(`Could not read backend directory:`, error);
        }

        this.logger.log(`Total files found: ${allFiles.length}`);

        allFiles.sort((a, b) => {
            if (a.isUploaded && !b.isUploaded) return -1;
            if (!a.isUploaded && b.isUploaded) return 1;
            return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        });

        this.logger.log('Final template list:', allFiles.map(f => ({ file: f.file, isUploaded: f.isUploaded })));

        return allFiles;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const invitation = await this.invitationsService.findOne(id);
        if (!invitation) {
            throw new HttpException('Invitation not found', HttpStatus.NOT_FOUND);
        }
        return invitation;
    }

    @Get(':id/preview')
    async previewInvitation(@Param('id') id: string, @Res() res: Response) {
        try {
            const html = await this.invitationsService.generateInvitationHtml(id);
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } catch (error) {
            throw new HttpException('Invitation not found', HttpStatus.NOT_FOUND);
        }
    }
}