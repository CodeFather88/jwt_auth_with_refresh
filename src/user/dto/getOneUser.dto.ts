import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class GetOneUserDto {
    @IsUUID()
    @ApiProperty({ description: 'ID пользователя', example: 'uuid' })
    id: string
}