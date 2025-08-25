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
var GuestsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsController = void 0;
const common_1 = require("@nestjs/common");
const guests_service_1 = require("./guests.service");
const create_guest_dto_1 = require("./dto/create-guest.dto");
const QRCode = require("qrcode");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let GuestsController = GuestsController_1 = class GuestsController {
    constructor(guestsService) {
        this.guestsService = guestsService;
        this.logger = new common_1.Logger(GuestsController_1.name);
    }
    async create(createGuestDto) {
        this.logger.log(`Received guest creation request for: ${createGuestDto.firstName} ${createGuestDto.lastName}`);
        this.logger.debug('Request body:', JSON.stringify(createGuestDto, null, 2));
        try {
            const result = await this.guestsService.create(createGuestDto);
            this.logger.log(`Guest created successfully: ${result.guest.id}`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to create guest:', error);
            throw error;
        }
    }
    async createWithQRCode(body, res) {
        try {
            const [firstName, lastName] = body.name.split(' ') || ['', ''];
            const createGuestDto = {
                firstName,
                lastName,
                email: body.email,
                phone: body.phone,
                numberOfGuests: 1,
            };
            const guest = await this.guestsService.create(createGuestDto);
            if (!guest) {
                throw new Error('Guest creation failed.');
            }
            const alphanumericCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            const qrCodeData = await QRCode.toDataURL(alphanumericCode);
            res.status(common_1.HttpStatus.CREATED).json({
                message: 'Guest created successfully. Please keep the code safe.',
                guest,
                qrCode: qrCodeData,
                alphanumericCode,
            });
        }
        catch (error) {
            console.error('[GuestsController] Failed to create guest:', error.message);
            res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
            });
        }
    }
    async findAll() {
        return await this.guestsService.findAll();
    }
    async findAllAdmin(groupId, search, page = '1', limit = '10') {
        console.log('Finding all admin guests...');
        console.log('Query parameters:', { groupId, search, page, limit });
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        console.log('Parsed parameters:', { pageNumber, limitNumber });
        const result = await this.guestsService.findAllAdmin(groupId, search, pageNumber, limitNumber);
        console.log('Guests found:', result.guests.length);
        console.log('Total count:', result.total);
        console.log('Response structure:', { guests: result.guests?.length || 0, total: result.total });
        return result;
    }
    async getStats() {
        return await this.guestsService.getStats();
    }
    async getExtendedStats(eventDate) {
        return await this.guestsService.getExtendedStats(eventDate);
    }
    async findOne(id) {
        const guest = await this.guestsService.findOne(id);
        if (!guest) {
            throw new common_1.HttpException('Guest not found', common_1.HttpStatus.NOT_FOUND);
        }
        return guest;
    }
    async remove(id) {
        return await this.guestsService.remove(id);
    }
    async findAllUnpaginated() {
        return await this.guestsService.findAllUnpaginated();
    }
};
exports.GuestsController = GuestsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_guest_dto_1.CreateGuestDto]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "createWithQRCode", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('groupId')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('stats/extended'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('eventDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "getExtendedStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "findAllUnpaginated", null);
exports.GuestsController = GuestsController = GuestsController_1 = __decorate([
    (0, common_1.Controller)('guests'),
    __metadata("design:paramtypes", [guests_service_1.GuestsService])
], GuestsController);
//# sourceMappingURL=guests.controller.js.map