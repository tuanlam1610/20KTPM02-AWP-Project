import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AuthDto,
  SignUpDto,
  ResetPasswordDto,
  SocialLoginDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import { ConfigService } from '@nestjs/config';
import { STATUS_CODES } from 'http';
import { FirebaseService } from 'src/firebase/firebase.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService, // eslint-disable-next-line prettier/prettier
    private firebaseService: FirebaseService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const AT_SECRET_KEY = this.configService.get<string>('AT_SECRET_KEY');
    const RT_SECRET_KEY = this.configService.get<string>('RT_SECRET_KEY');
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
        },
        { expiresIn: '15m', secret: AT_SECRET_KEY },
      ), //TODO sync and make it better later
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
        },
        { expiresIn: '7d', secret: RT_SECRET_KEY },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }

  async returnTokens(email: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  // async decodeToken(token: string) {
  //   try {
  //     const decodedToken = await this.firebaseService.decodeToken(token);
  //     return { success: true, decodedToken };
  //   } catch (error) {
  //     return { success: false, message: error.message };
  //   }
  // }

  async signupLocal(dto: SignUpDto): Promise<String> {
    const hash = await this.hashData(dto.password);
    await this.prisma.user.create({
      data: {
        email: dto.email,
        hash: hash,
        name: dto.name,
        dob: dto.dob,
      },
    });
    return STATUS_CODES.OK;
  }

  async signinLocal(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Invalid credentials');
    console.log('pepsi', user.hash);
    const isPasswordValid = await bcrypt.compare(dto.password, user.hash);
    if (!isPasswordValid) throw new ForbiddenException('Invalid credentials');
    if (!user.isEmailConfirm) {
      throw new UnauthorizedException('Email not confirmed');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async signinGoogle(dto: SocialLoginDto) {
    const decodedToken = await this.firebaseService.decodeToken(dto.idToken);

    let user = await this.prisma.user.findUnique({
      where: { email: decodedToken.email },
    });
    if (!user) {
      const googleEmail = decodedToken.email;
      if (googleEmail) {
        user = await this.prisma.user.create({
          data: {
            email: googleEmail,
            hash: 'google',
            name: decodedToken.name,
            isEmailConfirm: true,
          },
        });
      } else {
        throw new ForbiddenException('token does not have email');
      }
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async signinFacebook(dto: SocialLoginDto) {
    const decodedToken = await this.firebaseService.decodeToken(dto.idToken);
    let facebookEmail = decodedToken.email;
    if (!facebookEmail) facebookEmail = decodedToken.user_id + '@facebook.com';
    let user = await this.prisma.user.findUnique({
      where: { email: facebookEmail },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: facebookEmail,
          hash: 'facebook',
          name: decodedToken.name,
          isEmailConfirm: true,
        },
      });
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: { id: userId, hashedRt: { not: null } },
      data: { hashedRt: null },
    });
  }
  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    let user = await this.prisma.user.findUnique({
      where: { email: resetPasswordDto.email },
    });
    if (!user) throw new ForbiddenException('Invalid credentials');
    // const isPasswordValid = await bcrypt.compare(
    //   resetPasswordDto.password,
    //   user.hash,
    // );
    // if (!isPasswordValid) throw new ForbiddenException('Invalid credentials');
    if (!user.isEmailConfirm) {
      throw new UnauthorizedException('Email not confirmed');
    }
    //console.log(typeof resetPasswordDto.newPassword.toString());
    const hash = await this.hashData(resetPasswordDto.newPassword.toString());
    user = await this.prisma.user.update({
      where: { email: resetPasswordDto.email },
      data: {
        hash: hash,
      },
    });
    console.log(hash);
    //Probably not return tokens
    // const tokens = await this.getTokens(user.id, user.email);
    // await this.updateRtHash(user.id, tokens.refreshToken);
    // return tokens;
  }
}
