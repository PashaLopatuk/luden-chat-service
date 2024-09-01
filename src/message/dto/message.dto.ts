import {IsNumber, IsString} from "class-validator";

export class MessageDto {
  @IsNumber()
  chatId: number

  @IsString()
  content: string
}