import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Max, Min } from "class-validator";

export class ListDto {
    @ApiProperty()
    @IsInt()
    @Min(5)
    @Max(100)
    take: number

    @ApiProperty()
    @IsInt()
    @Min(0)
    @Max(100)
    skip: number
}