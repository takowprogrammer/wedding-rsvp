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
var GuestGroupsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestGroupsController = void 0;
const common_1 = require("@nestjs/common");
const guest_groups_service_1 = require("./guest-groups.service");
const create_guest_group_dto_1 = require("./dto/create-guest-group.dto");
let GuestGroupsController = GuestGroupsController_1 = class GuestGroupsController {
    constructor(guestGroupsService) {
        this.guestGroupsService = guestGroupsService;
        this.logger = new common_1.Logger(GuestGroupsController_1.name);
    }
    async findAll() {
        this.logger.log('Received request to fetch all guest groups');
        try {
            const groups = await this.guestGroupsService.findAll();
            this.logger.log(`Found ${groups.length} guest groups`);
            return groups;
        }
        catch (error) {
            this.logger.error('Failed to fetch guest groups:', error);
            throw error;
        }
    }
    async create(createGuestGroupDto) {
        this.logger.log(`Received request to create guest group: ${createGuestGroupDto.name}`);
        try {
            const result = await this.guestGroupsService.create(createGuestGroupDto.name.trim());
            this.logger.log(`Guest group created successfully: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to create guest group:', error);
            throw new common_1.HttpException('Failed to create group', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GuestGroupsController = GuestGroupsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestGroupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_guest_group_dto_1.CreateGuestGroupDto]),
    __metadata("design:returntype", Promise)
], GuestGroupsController.prototype, "create", null);
exports.GuestGroupsController = GuestGroupsController = GuestGroupsController_1 = __decorate([
    (0, common_1.Controller)('guest-groups'),
    __metadata("design:paramtypes", [guest_groups_service_1.GuestGroupsService])
], GuestGroupsController);
//# sourceMappingURL=guest-groups.controller.js.map