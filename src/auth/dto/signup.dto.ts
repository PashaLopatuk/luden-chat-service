import {IsEmail, IsString, MinLength} from "class-validator";

export class SignupDTO {
  @IsString()
  name: string

  @IsString()
  login: string

  @IsString()
  @MinLength(6)
  password: string
}