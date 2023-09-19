import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInLocalDto, SignUpLocalDto } from './dtos';
import { Tokens } from './types/tokens.type';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @ApiOperation({ summary: 'Signup a new user' })
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() body: SignUpLocalDto): Promise<Tokens> {
        return this.authService.signUpLocal(body);
    }

    @Public()
    @ApiOperation({ summary: 'Signin an existing user' })
    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() body: SignInLocalDto): Promise<Tokens> {
        return this.authService.signInLocal(body.email, body.password);
    }

    @ApiOperation({ summary: 'Signout a signed in user' })
    @ApiBearerAuth()
    @Post('local/signout')
    @HttpCode(HttpStatus.OK)
    async signOut(@CurrentUser('userId') userId: string) {
        return this.authService.signOutLocal(userId);
    }
}
