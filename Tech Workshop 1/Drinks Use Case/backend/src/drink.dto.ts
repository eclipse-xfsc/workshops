import {ApiProperty} from "@nestjs/swagger";

export class DrinkDto {
    @ApiProperty()
    public drink: string;
}