import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../enums/role.enum';


export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, minlength: 5, maxlength: 50 })
  email: string;

  @Prop({ required: true, minlength: 8, maxlength: 1024 })
  password: string;

  @Prop({ required: true, minlength: 4, maxlength: 30 })
  firstName: string;

  @Prop({ required: true, minlength: 4, maxlength: 30 })
  lastName: string;

  @Prop({ default: null, minlength: 8, maxlength: 1024 })
  hashedRt: string;

  @Prop({ default: [Role.User], type: [String], enum: [Role] })
  roles: Role[];

  @Prop({ default: false, type: Boolean })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);