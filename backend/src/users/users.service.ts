import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

//TODO
// GO TO EACH CONTROLLER AND ADD PROPER TAG FOR SWAGGER
// ADD PROPER RESPONSE CODE
// ADD ADMINS STUFF
// ADD AUTHORIZATION
//helper
export function exclude<User, Key extends keyof User>(
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

  markEmailConfirmed(email: string) {
    return this.prisma.user.update({
      where: { email: email },
      data: {
        isEmailConfirm: true,
      },
    });
  }

  //CRUD
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        studentId: { select: { id: true } },
        teacherId: { select: { id: true } },
        adminId: { select: { id: true } },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // findAllRegistered() {
  //   return this.prisma.user.findMany({ where: { isRegistered: true } });
  // }
  async getUserProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        studentId: { select: { id: true } },
        teacherId: { select: { id: true } },
        adminId: { select: { id: true } },
      },
    });
    const userWithoutPassword = exclude(user, ['hash', 'hashedRt']);
    return userWithoutPassword;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    const userWithoutPassword = exclude(user, ['hash', 'hashedRt']);
    return userWithoutPassword;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      let fetchedStudent = null;
      let fetchedTeacher = null;
      let fetchedAdmin = null;

      if (updateUserDto.studentId) {
        //prolly unecessary
        fetchedStudent = await this.prisma.student.findUnique({
          where: { id: updateUserDto.studentId },
        });

        if (!fetchedStudent) {
          throw new Error(
            `Student with ID ${updateUserDto.studentId} not found`,
          );
        }
      } else if (updateUserDto.teacherId) {
        fetchedTeacher = await this.prisma.teacher.findUnique({
          where: { id: updateUserDto.teacherId },
        });

        if (!fetchedTeacher) {
          throw new Error(
            `Teacher with ID ${updateUserDto.teacherId} not found`,
          );
        }
      } else if (updateUserDto.adminId) {
        fetchedAdmin = await this.prisma.admin.findUnique({
          where: { id: updateUserDto.adminId },
        });

        if (!fetchedAdmin) {
          throw new Error(`Admin with ID ${updateUserDto.adminId} not found`);
        }
      }
      let fetchedComment = [];
      if (updateUserDto.comment) {
        fetchedComment = await this.prisma.comment.findMany({
          where: { id: { in: updateUserDto.comment } },
        });
      }
      if (fetchedComment.length ?? 0 !== updateUserDto.comment.length) {
        const notFoundIds = updateUserDto.comment.filter(
          (cId) => !fetchedComment.some((c) => c.id === cId),
        );
        throw new Error(`Comment IDs ${notFoundIds.join(', ')}User not found`);
      }

      const updateData: any = {
        ...updateUserDto,
        comment: {
          connect: fetchedComment.map((c) => ({ id: c.id })),
        },
      };

      if (fetchedStudent) {
        updateData.roles = ['student'];
      }

      if (fetchedTeacher) {
        updateData.roles = ['teacher'];
      }

      if (fetchedAdmin) {
        updateData.roles = ['admin'];
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: {
          ...updateData,
          studentId: fetchedStudent
            ? { connect: { id: fetchedStudent.id } }
            : undefined,
          teacherId: fetchedTeacher
            ? { connect: { id: fetchedTeacher.id } }
            : undefined,
          adminId: fetchedAdmin
            ? { connect: { id: fetchedAdmin.id } }
            : undefined,
        },
        include: {
          studentId: true,
          teacherId: true,
          adminId: true,
        },
      });
      return updatedUser;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async updateByEmail(email: string, updateUserDto: UpdateUserDto) {
    try {
      let fetchedStudent = null;
      let fetchedTeacher = null;
      let fetchedAdmin = null;

      if (updateUserDto.studentId) {
        fetchedStudent = await this.prisma.student.findUnique({
          where: { id: updateUserDto.studentId },
        });

        if (!fetchedStudent) {
          throw new Error(
            `Student with ID ${updateUserDto.studentId} not found`,
          );
        }
      } else if (updateUserDto.teacherId) {
        fetchedTeacher = await this.prisma.teacher.findUnique({
          where: { id: updateUserDto.teacherId },
        });

        if (!fetchedTeacher) {
          throw new Error(
            `Teacher with ID ${updateUserDto.teacherId} not found`,
          );
        }
      } else if (updateUserDto.adminId) {
        fetchedAdmin = await this.prisma.admin.findUnique({
          where: { id: updateUserDto.adminId },
        });

        if (!fetchedAdmin) {
          throw new Error(`Admin with ID ${updateUserDto.adminId} not found`);
        }
      } else {
        throw new Error('No user type provided');
      }

      let fetchedComment = [];
      if (updateUserDto.comment) {
        fetchedComment = await this.prisma.comment.findMany({
          where: { id: { in: updateUserDto.comment } },
        });
      }

      if (fetchedComment.length ?? 0 !== updateUserDto.comment.length) {
        const notFoundIds = updateUserDto.comment.filter(
          (cId) => !fetchedComment.some((c) => c.id === cId),
        );
        throw new Error(`Comment IDs ${notFoundIds.join(', ')} not found`);
      }
      const updateData: any = {
        ...updateUserDto,
        comment: {
          connect: fetchedComment.map((c) => ({ id: c.id })),
        },
      };

      if (fetchedStudent) {
        updateData.roles = ['student'];
      }

      if (fetchedTeacher) {
        updateData.roles = ['teacher'];
      }

      if (fetchedAdmin) {
        updateData.roles = ['admin'];
      }

      const updatedUser = await this.prisma.user.update({
        where: { email: email },
        data: {
          ...updateData,
          studentId: fetchedStudent
            ? { connect: { id: fetchedStudent.id } }
            : undefined,
          teacherId: fetchedTeacher
            ? { connect: { id: fetchedTeacher.id } }
            : undefined,
          adminId: fetchedAdmin
            ? { connect: { id: fetchedAdmin.id } }
            : undefined,
        },
        include: {
          studentId: true,
          teacherId: true,
          adminId: true,
        },
      });

      return updatedUser;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id: id } });
  }

  // async setTwoFactorAuthenticationSecret(secret: string, soDienThoai: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { soDienThoai: soDienThoai },
  //   });
  //   user['twoFactorAuthenticationSecret'] = secret;
  // }
}
