import {BadRequestException, ForbiddenException, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class DrinksService {

    protected readonly drinks = new Map<string, string>();
    protected readonly allowedDrinks = [
        'WHISKY SOUR',
        'TEQUILA SHOT',
        'CUBA LIBRE',
        'VODKA MARTINI',
    ]

    constructor(public readonly jwtService: JwtService) {
    }

    public getUserSub(headers: Record<string, string>): string {
        const token = this.getToken(headers);
        if (!token['sub']) {
            throw new UnauthorizedException();
        }
        return token['sub'];
    }

    public validateBartenderRole(headers: Record<string, string>): void {
        const token = this.getToken(headers);
        if (!token['roles'].includes('Barkeeper')) {
            throw new ForbiddenException('Not a Barkeeper!');
        }
    }

    protected getToken(headers: Record<string, string>) {
        if (!headers['authorization']) {
            throw new UnauthorizedException();
        }
        if (!headers['authorization'].startsWith('Bearer ')) {
            throw new BadRequestException('Expected Bearer Authentication');
        }
        const tokenStr = headers['authorization'].split(' ')[1];
        return this.jwtService.decode(tokenStr);
    }

    public setDrink(userSub: string, drink: string): void {
        if (!this.allowedDrinks.includes(drink)) {
            throw new BadRequestException('Expected drink to be one of ' + this.allowedDrinks.join(', '));
        }
        this.drinks.set(userSub, drink);
    }

    public getDrink(userSub: string): string | undefined {
        return this.drinks.get(userSub);
    }

    public getDrinkStatistics(): Record<string, number> {
        const res: Record<string, number> = {};
        for (const drink of this.drinks.values()) {
            res[drink] = res[drink] ? res[drink]++ : 1;
        }
        return res;
    }
}
