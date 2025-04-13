import { Module } from '@nestjs/common';
import { MyDrinkController } from './my-drink.controller';
import { DrinksController } from './drinks.controller';
import { DrinksService } from './drinks.service';
import { LoginController } from './aas.controller';
import {JwtModule} from "@nestjs/jwt";
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [JwtModule,HttpModule],
  controllers: [MyDrinkController, DrinksController, LoginController],
  providers: [DrinksService],
})
export class AppModule {}
