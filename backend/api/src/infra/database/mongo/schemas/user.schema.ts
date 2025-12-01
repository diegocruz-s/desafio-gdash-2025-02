import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OptionsAccount } from 'src/domain/user/entity/user';

export type UserDocument = HydratedDocument<UserMongo>;

@Schema({ collection: 'users' })
export class UserMongo {
  @Prop({ type: String })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: true })
  role: OptionsAccount;
}

export const UserSchema = SchemaFactory.createForClass(UserMongo);
