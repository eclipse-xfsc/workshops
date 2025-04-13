import {BadRequestException, Body, Controller, Get, Post, Request} from '@nestjs/common';
import {DrinksService} from "./drinks.service";
import {ApiBearerAuth, ApiOperation} from "@nestjs/swagger";
import {DrinkDto} from "./drink.dto";

@Controller('mydrink')
export class MyDrinkController {

    constructor(public readonly drinksService: DrinksService) {}

    @Get('')
    @ApiOperation({
        description: 'Allows users to get their preferred drink.',
    })
    @ApiBearerAuth()
    public get(@Request() req) {
        const userSub = this.drinksService.getUserSub(req.headers);
        return {
            drink: this.drinksService.getDrink(userSub) ?? null,
        }
    }

    @Post('')
    @ApiOperation({
        description: 'Allows users to set their preferred drink.',
    })
    @ApiBearerAuth()
    public post(@Request() req, @Body() body: DrinkDto) {
        const userSub = this.drinksService.getUserSub(req.headers);
        const drink = body.drink;
        if (!drink) {
            throw new BadRequestException('Expected drink property to be set.');
        }
        this.drinksService.setDrink(userSub, drink);
        return {
            drink
        };
    }
}
