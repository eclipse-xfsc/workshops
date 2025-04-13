import {Controller, Get, NotImplementedException, Request} from '@nestjs/common';
import {DrinksService} from "./drinks.service";
import {ApiBearerAuth, ApiOperation} from "@nestjs/swagger";

@Controller('drinks')
export class DrinksController {

    constructor(public readonly drinksService: DrinksService) {}

    @Get('')
    @ApiOperation({
        description: 'Allows barkeepers to get a list of all drinks and their count.',
    })
    @ApiBearerAuth()
    public get(@Request() req) {
        this.drinksService.validateBartenderRole(req.headers);
        return this.drinksService.getDrinkStatistics();
    }
}
