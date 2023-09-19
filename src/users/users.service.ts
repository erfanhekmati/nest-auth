import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { UserInterface } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types as MongooseTypes } from 'mongoose';
import { Role } from './enums/role.enum';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    public async findAll() {
        const users = await this.userModel.find({ deleted: false }, {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            roles: 1,
            createdAt: 1,
            updatedAt: 1
        });
        return users;
    }

    public async findById(_id: string | MongooseTypes.ObjectId) {
        const user = await this.userModel.findOne({
            _id,
            deleted: false
        }, {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            roles: 1,
            createdAt: 1,
            updatedAt: 1
        });
        if(!user) throw new NotFoundException('User not found.');
        return user;
    }

    public async findByEmail(email: string) {
        const user = await this.userModel.findOne({
            email,
            deleted: false
        }, {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            roles: 1,
            createdAt: 1,
            updatedAt: 1
        });
        if(!user) throw new NotFoundException('User not found.');
        return user;
    }

    public async isEmailTaken(email :string): Promise<boolean> {
        if(await this.userModel.findOne({ email, deleted: false })) return true;
        return false;
    }

    public async create(user: Partial<UserInterface>) {
        const newUser = await this.userModel.create(user);
        return await this.findById(newUser._id);
    }

    public async removeById(id: string | MongooseTypes.ObjectId) {
        const user = await this.findById(id);
        user.deleted = true;
        await user.save();
        const { _id, firstName, lastName, email, roles } = user;
        return { _id, firstName, lastName, email, roles };
    }

    public async changePasswordById(_id: string | MongooseTypes.ObjectId, newPassword: string) {
        const user = await this.findById(_id);
        user.password = newPassword;
        await user.save();
        return await this.findById(_id);
    }

    public async updateHashedRt(_id: string | MongooseTypes.ObjectId, newHashedRT: string) {
        const user = await this.findById(_id);
        user.hashedRt = newHashedRT;
        await user.save();
        return await this.findById(_id);
    }

    public async updateRoles(_id: string | MongooseTypes.ObjectId, newRoles: Role[]) {
        const user = await this.findById(_id);
        user.roles = newRoles;
        await user.save();
        return await this.findById(_id);
    }

    public async comparePasswords(email: string, password: string): Promise<boolean> {
        const user = await this.userModel.findOne({ email });
        if (user) {
            const passMatches = await bcrypt.compare(password, user.password);
            return passMatches;
        }
        return false;
    }
}