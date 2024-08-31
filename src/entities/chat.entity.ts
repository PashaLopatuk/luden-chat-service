import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Message} from "./message.entity";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  title?: string

  @Column()
  description?: string

  @Column()
  createdAt: Date

  @ManyToMany(() => User)
  members: User[]

  @OneToMany(() => Message, message => message.chat)
  messages: Message[]
}