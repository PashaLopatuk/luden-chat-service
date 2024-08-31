import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Chat} from "./chat.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  text: string

  @OneToOne(() => User)
  author: User

  @ManyToOne(() => Chat, chat => chat.messages)
  chat: Chat
}