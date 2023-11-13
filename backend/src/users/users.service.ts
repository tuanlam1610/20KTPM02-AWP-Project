import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

//helper
function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  const filteredEntries = Object.entries(user).filter(
    ([key]) => !keys.includes(key as Key),
  );
  const filteredObject = Object.fromEntries(filteredEntries) as Omit<User, Key>;
  return filteredObject;
}
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //CRUD
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  // findAllRegistered() {
  //   return this.prisma.user.findMany({ where: { isRegistered: true } });
  // }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    const userWithoutPassword = exclude(user, ['hash', 'hashedRt']);
    return userWithoutPassword;
  }

  update(id: number, updateUserDTO: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: id },
      data: updateUserDTO,
    });
  }

  updateByEmail(email: string, updateUserDTO: UpdateUserDto) {
    return this.prisma.user.update({
      where: { email: email },
      data: updateUserDTO,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id: id } });
  }

  // async setTwoFactorAuthenticationSecret(secret: string, soDienThoai: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { soDienThoai: soDienThoai },
  //   });
  //   user['twoFactorAuthenticationSecret'] = secret;
  // }
}
