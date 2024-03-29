import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseSearchRequest } from '../../core/base-search-request';
import { BaseController } from '../../core/base.controller';
import { GenericResponse } from '../../core/generic-response';
import { AllowRoles } from '../../decorators/allow-roles.decorator';
import { ApiDocs } from '../../decorators/api.decorator';
import { RolesList } from '../../types/enums';
import {
  GetUserRoleResponse,
  GetUserRolesRequest,
  GetUserRolesResponse,
  UserRoleDto,
} from './user-role.dto';
import { UserRole } from './user-role.entity';
import { UserRoleService } from './user-roles.service';

@Controller('users-roles')
@ApiTags('users-roles')
export class UsersRolesController extends BaseController {
  constructor(private readonly userRoleService: UserRoleService) {
    super();
  }

  @Get(':id')
  @AllowRoles(RolesList.Admin)
  @ApiDocs({
    summary: 'Get role',
    operationId: 'getUserRole',
    resStatus: HttpStatus.OK,
    resType: GetUserRoleResponse,
  })
  async getUserRole(@Param('id') id: string): Promise<GetUserRoleResponse> {
    return await this.userRoleService.findOne({ where: { id: id } });
  }

  @Get()
  @AllowRoles(RolesList.Admin)
  @ApiDocs({
    summary: 'Get all roles',
    operationId: 'getUserRoles',
    resStatus: HttpStatus.OK,
    resType: GetUserRolesResponse,
  })
  async getUserRoles(
    @Query() request: GetUserRolesRequest,
  ): Promise<GetUserRolesResponse> {
    const findOptions = BaseSearchRequest.getDefaultFindOptions<UserRole>(
      request,
    );
    if (request.includeDisabled === 'true') {
      findOptions.where = { disabled: true };
    }
    return await this.userRoleService.findAll(findOptions);
  }

  @Post()
  @AllowRoles(RolesList.Admin)
  @ApiDocs({
    summary: 'Create or update role',
    operationId: 'createOrUpdateRole',
    resStatus: HttpStatus.CREATED,
    resType: GetUserRoleResponse,
  })
  async createOrUpdateRole(
    @Body() userRole: UserRoleDto,
  ): Promise<GetUserRoleResponse> {
    return await this.userRoleService.createOrUpdate(userRole);
  }

  @Delete()
  @AllowRoles(RolesList.Admin)
  @ApiDocs({
    summary: 'Delete roles',
    operationId: 'deleteRoles',
    resStatus: HttpStatus.OK,
    resType: GenericResponse,
  })
  async deleteRoles(@Query('ids') ids: string): Promise<GenericResponse> {
    return await this.userRoleService.delete(ids.split(','));
  }

  // @Patch('archiveRoles')
  // @AllowRoles(RolesList.Admin)
  // @ApiDocs({
  //   summary: 'Archive roles',
  //   operationId: 'archiveRoles',
  //   resStatus: HttpStatus.CREATED,
  //   resType: GenericResponse,
  // })
  // async archiveRoles(@Query('ids') ids: string): Promise<GenericResponse> {
  //   return await this.userRoleService.archive(ids.split(','));
  // }
}
