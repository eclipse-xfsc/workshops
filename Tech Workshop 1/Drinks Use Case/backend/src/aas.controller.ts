import {BadRequestException, Controller, Get, NotImplementedException, Post, Query, Injectable} from '@nestjs/common';
import {ApiOperation} from "@nestjs/swagger";
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
@Controller('register')
export class LoginController {

    constructor(private readonly httpService: HttpService) {}

    @Get('')
    @ApiOperation({
        description: 'Allows users to register.',
    })
    public get(@Query('barkeeper') barkeeper: Boolean) {
        return lastValueFrom(this.httpService.post('https://integration.gxfs.dev/api/workshop/connection/v1/invitation-url?alias=trust').pipe(map(response => response.data)))
    }
    @Get('/status/:id')
    @ApiOperation({
        description: 'Check registration status.',
    })
    public getStatus(@Param('id') id: string) {
        if (Math.random() > 0.5)
        {
            throw new HttpException(`${id} You are not allowed to do that`, HttpStatus.FORBIDDEN);
        }
        else
        {
            return {"statusCode":200,"message":`${id} You are in`};
        }
    }
}