import { User } from "@prisma/client"

export class GenerateTokensDto {
    agent: string
    user: Partial<User>
}