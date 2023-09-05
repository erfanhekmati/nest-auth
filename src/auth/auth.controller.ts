import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpLocalDto } from './dtos/signup-local.dto';
import { Tokens } from './types/tokens.type';
import { AuthService } from './auth.service';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Signup a new user' })
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() body: SignUpLocalDto): Promise<Tokens> {
        return this.authService.signUpLocal(body);
    }
}
