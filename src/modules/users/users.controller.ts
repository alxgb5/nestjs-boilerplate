import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetUserResponse,
  GetUsersRequest,
  GetUsersResponse,
  UserDto,
} from './user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Like } from 'typeorm';
import { BaseController } from '../../core/base.controller';
import { BaseSearchRequest } from '../../core/base-search-request';
import { GenericResponse } from '../../core/generic-response';
import { AllowRoles } from '../../decorators/allow-roles.decorator';
import { ApiDocs } from '../../decorators/api.decorator';
import { UserLogged } from '../../decorators/user-logged.decorator';
import { AuthToolsService } from '../../helpers/auth-helper';
import { SharedService } from '../../helpers/shared-service';
import { RolesList } from '../../types/enums';

@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authToolsService: AuthToolsService,
  ) {
    super();
  }

  @Get()
  @AllowRoles(RolesList.Admin)
  @ApiDocs({
    summary: 'Get all users',
    operationId: 'getAllUsers',
    resStatus: HttpStatus.OK,
    resType: GetUsersResponse,
  })
  async getAll(@Query() request: GetUsersRequest): Promise<GetUsersResponse> {
    const findOptions = BaseSearchRequest.getDefaultFindOptions<User>(request);
    if (request.search) {
      if (!findOptions.where) findOptions.where = [{}];
      findOptions.where = [
        { firstname: Like('%' + request.search + '%') },
        { lastname: Like('%' + request.search + '%') },
      ];
    }
    return await this.usersService.findAll(findOptions);
  }

  @Get(':id')
  @UserLogged()
  @ApiDocs({
    summary: 'Get user',
    operationId: 'getUser',
    resStatus: HttpStatus.OK,
    resType: GetUserResponse,
  })
  async get(@Param('id') id: string): Promise<GetUserResponse> {
    if (!id)
      throw new BadRequestException("Impossible de trouver l'utilisateur");
    const payload = this.checkUserPayload(this.authToolsService);
    if (!SharedService.userIsAdmin(payload) && payload.id !== id)
      throw new ForbiddenException(
        "Vous n'avez pas l'autorisation de faire cela.",
      );
    return await this.usersService.findOne({ where: { id: id } });
  }

  @Post()
  @AllowRoles(RolesList.Admin, RolesList.Visitor)
  @ApiDocs({
    summary: 'Create or update user',
    operationId: 'createOrUpdateUser',
    resStatus: HttpStatus.CREATED,
    resType: GetUserResponse,
  })
  async createOrUpdate(@Body() userDto: UserDto): Promise<GetUserResponse> {
    if (!userDto) throw new BadRequestException('Invalid Request');
    const payload = this.checkUserPayload(this.authToolsService);
    if (!SharedService.userIsAdmin(payload) && payload.id !== userDto.id)
      throw new ForbiddenException(
        "Vous n'avez pas l'autorisation de faire cela.",
      );
    return await this.usersService.createOrUpdate(userDto);
  }

  @Patch('archive')
  @AllowRoles(RolesList.Admin)
  @ApiDocs({
    summary: 'Archive user',
    operationId: 'archiveUsers',
    resStatus: HttpStatus.OK,
    resType: GenericResponse,
  })

  @Delete()
  @AllowRoles(RolesList.Visitor)
  @ApiDocs({
    summary: 'Delete account',
    operationId: 'deleteAccount',
    resStatus: HttpStatus.OK,
    resType: GenericResponse,
  })
  async deleteAccount(): Promise<GenericResponse> {
    const payload = this.checkUserPayload(this.authToolsService);
    return await this.usersService.deleteOne(payload.id);
  }

  @Delete()
  @AllowRoles(RolesList.Admin)
  @ApiDocs({
    summary: 'Delete users',
    operationId: 'deleteUsers',
    resStatus: HttpStatus.OK,
    resType: GenericResponse,
  })
  async deleteUsers(
    @Query('userIds') userIds: string,
  ): Promise<GenericResponse> {
    return await this.usersService.delete(userIds.split(','));
  }
}