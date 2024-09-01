import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Message} from "./message.entity";


@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  title?: string

  @Column({ nullable: true })
  description?: string

  @Column()
  createdAt: Date

  @ManyToMany(() => User, user => user.chats)
  @JoinTable({name: 'users-chats'})
  users: User[]

  @OneToMany(() => Message, message => message.chat)
  messages: Message[]
}