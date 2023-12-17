import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  HttpCode,
  Req,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enum/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('getUserProfile')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  findUserByAT(@Req() req: any) {
    const user = req.user;
    return this.usersService.findOne(user['sub']);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @ApiBearerAuth('jwt')
  @Roles(Role.ADMIN)
  @ApiCreatedResponse({ type: UserEntity })
  @HttpCode(HttpStatus.OK)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ type: UserEntity })
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`Could not find article with ${id}.`);
    }
    return user;
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
