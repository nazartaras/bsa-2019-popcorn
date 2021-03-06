import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique
} from "typeorm";
import { User } from "../User";
import { Event } from "./Event";

@Entity()
@Unique(["userId", "eventId"])
export class EventVisitor {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(type => User, user => user.id, {
    onDelete: "CASCADE"
  })
  @JoinColumn()
  user: User;

  @ManyToOne(type => Event, event => event.eventVisitors, {
    onDelete: "CASCADE"
  })
  @JoinColumn()
  event: Event;

  @Column()
  status: string;

  @Column()
  userId: string;

  @Column()
  eventId: string;
}
