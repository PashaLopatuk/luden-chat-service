import {IsString, IsOptional} from "class-validator";


export class CreateChatDTO {
  @IsOptional()
  @IsString()
  receiver?: string

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string
}