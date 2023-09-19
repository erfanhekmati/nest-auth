import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SignUpLocalDto } from './dtos/signup-local.dto';
import { Tokens } from './types/tokens.type';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/users/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Types as MongooseTypes } from 'mongoose';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    private async hashData(text: string) {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(text, salt);
    }

    private async getTokens (userId: string | MongooseTypes.ObjectId , email: string, roles: Role[]) {
        return {
          access_token: await this.jwtService.sign(
            { userId, email, roles },
            { 
              secret: this.configService.get('jwt.access.secret'),
              expiresIn: this.configService.get('jwt.access.exp')
            }
          ),
          refresh_token: await this.jwtService.sign(
            { userId, email, roles },
            { 
              secret: this.configService.get('jwt.refresh.secret'),
              expiresIn: this.configService.get('jwt.refresh.exp')
            }
          )
        }
    }

    private async validateUser(email: string, pass: string): Promise<any> {
      if(await this.usersService.comparePasswords(email, pass)) return await this.usersService.findByEmail(email);
      return null;
    }
    
    public async signUpLocal(body: SignUpLocalDto): Promise<Tokens> {
        // Check for username availablitiy
        if(await this.usersService.isEmailTaken(body.email)) throw new BadRequestException('Email is already taken.');
    
        // Hash password
        body.password = await this.hashData(body.password);
    
        // Create new user
        const newUser = await this.usersService.create(body);
    
        // Get new tokens
        const tokens = await this.getTokens(newUser._id, newUser.email, newUser.roles);
    
        // Update refresh token
        await this.usersService.updateHashedRt(newUser._id, await this.hashData(tokens.refresh_token));
        
        return tokens;
    }

    public async signInLocal(username: string, password: string): Promise<Tokens> {
      // Validate user
      const user = await this.validateUser(username, password);
      if(!user) throw new UnauthorizedException('Invalid credentials.');
  
      // Get new tokens
      const tokens = await this.getTokens(user._id, user.email, user.roles);
  
      // Update refresh token
      this.usersService.updateHashedRt(user._id, await this.hashData(tokens.refresh_token))
      
      return tokens;
    }
}
