"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InvitationsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsController = void 0;
const common_1 = require("@nestjs/common");
const invitations_service_1 = require("./invitations.service");
const create_invitation_dto_1 = require("./dto/create-invitation.dto");
const fs = require("fs");
const path = require("path");
let InvitationsController = InvitationsController_1 = class InvitationsController {
    constructor(invitationsService) {
        this.invitationsService = invitationsService;
        this.logger = new common_1.Logger(InvitationsController_1.name);
    }
    async create(createInvitationDto) {
        this.logger.log(`Received invitation creation request: ${createInvitationDto.title}`);
        this.logger.debug('Invitation data:', JSON.stringify(createInvitationDto, null, 2));
        try {
            const result = await this.invitationsService.create(createInvitationDto);
            this.logger.log(`Invitation created successfully: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to create invitation:', error);
            throw error;
        }
    }
    async remove(id) {
        return await this.invitationsService.remove(id);
    }
    async findAll() {
        return await this.invitationsService.findAll();
    }
    async findActive() {
        return await this.invitationsService.findActive();
    }
    async listTemplates() {
        const candidates = [
            path.join(process.cwd(), 'frontend', 'public', 'invitations'),
            path.join(process.cwd(), 'public', 'invitations'),
        ];
        for (const dir of candidates) {
            try {
                const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.png'));
                if (files.length > 0) {
                    return files.map(f => ({
                        file: f,
                        templateName: path.parse(f).name,
                        imageUrl: `/invitations/${f}`,
                    }));
                }
            }
            catch { }
        }
        return [];
    }
    async findOne(id) {
        const invitation = await this.invitationsService.findOne(id);
        if (!invitation) {
            throw new common_1.HttpException('Invitation not found', common_1.HttpStatus.NOT_FOUND);
        }
        return invitation;
    }
    async previewInvitation(id, res) {
        try {
            const html = await this.invitationsService.generateInvitationHtml(id);
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        }
        catch (error) {
            throw new common_1.HttpException('Invitation not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.InvitationsController = InvitationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invitation_dto_1.CreateInvitationDto]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "listTemplates", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/preview'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "previewInvitation", null);
exports.InvitationsController = InvitationsController = InvitationsController_1 = __decorate([
    (0, common_1.Controller)('invitations'),
    __metadata("design:paramtypes", [invitations_service_1.InvitationsService])
], InvitationsController);
//# sourceMappingURL=invitations.controller.js.map