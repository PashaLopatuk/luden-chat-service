import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Chat} from "./chat.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number

  @Column({unique: true})
  login: string

  @Column()
  name: string

  @Column()
  password: string

  @ManyToMany(() => Chat, chat => chat.users)
  @JoinTable({name: 'users-chats'})
  chats: Chat[]
}