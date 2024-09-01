import {IsNumber, IsString} from "class-validator";

export class AddUserToChatDto {
  @IsNumber()
  chatId: number

  @IsString()
  receiverUserNickname: string
}