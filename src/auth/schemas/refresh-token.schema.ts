import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema()
export class RefreshToken {
  @Prop({required: true})
  token: string;

  @Prop({required: true})
  userId: Types.ObjectId

  @Prop({required: true})
  expiryDate: Date
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)