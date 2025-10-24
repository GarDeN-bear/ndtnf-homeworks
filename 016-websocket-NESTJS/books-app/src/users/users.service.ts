import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { UserDto } from '../dto/user.dto';
import { SignInDto } from '../dto/signin.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  public async signUp(data: UserDto): Promise<{ token: string }> {
    const { email, password, firstName } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.UserModel.create({
      email,
      password: hashedPassword,
      firstName,
    });

    return this.createToken({ id: user.id });
  }

  public async signIn(data: SignInDto): Promise<{ token: string }> {
    const { email, password } = data;
    const user = await this.UserModel.findOne({
      email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.createToken({ id: user.id });
  }

  public validateUser(id: string): Promise<UserDocument | null> {
    return this.UserModel.findById(id).exec();
  }

  public createToken(payload: any): { token: string } {
    return { token: this.jwtService.sign(payload) };
  }
}
