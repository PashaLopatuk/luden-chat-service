import {Prop} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";

@Entity()
export class UserTokens {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  token: string;

  @OneToOne(
    () => User,
    user => user.userId,
    {eager: true},
  )
  @JoinColumn({name: "userId"})
  user: User

  @Column()
  expiryDate: Date
}