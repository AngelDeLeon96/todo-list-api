/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        try {
            const user = await this.usersService.findByEmail(email);
            const isPasswordValid = await user.validatePassword(password);

            if (isPasswordValid) {
                const { password, ...result } = user;
                return result;
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        };
    }
}