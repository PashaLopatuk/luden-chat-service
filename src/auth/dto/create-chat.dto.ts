import {IsString, IsOptional} from "class-validator";


export class CreateChatDTO {
  @IsString()
  receiver: string

  @IsOptional()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description: string
}