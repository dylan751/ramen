import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponse } from './dto/login-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { AuthenticatedRequest } from '../common/types/authenticated-request';
import { UsersService } from '../organizations/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({
    tags: ['Auth'],
    operationId: 'Login',
    summary: 'Login endpoint for users',
    description: 'Login with email and password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginResponse,
  })
  async login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponse> {
    return await this.authService.login(loginRequest);
  }

  @Get('profile')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProfileResponseDto,
  })
  @ApiOperation({
    tags: ['Auth'],
    operationId: 'Get user profile',
    summary: 'Get user profile ',
    description: 'Return user data and their belonging organization',
  })
  @ApiBearerAuth('accessToken')
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<ProfileResponseDto> {
    return await this.usersService.findByIdWithOrganizationsAndRoles(
      req.user.id,
    );
  }
}
