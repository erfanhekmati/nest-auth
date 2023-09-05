import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { UserInterface } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types as MongooseTypes } from 'mongoose';
import { Role } from './enums/role.enum';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    public async findAll() {
        let users: any;
        try {
            users = await this.userModel.find({ deleted: false }, {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                roles: 1,
                createdAt: 1,
                updatedAt: 1
            });
        } catch (ex) {
            Logger.error(ex);
            throw new InternalServerErrorException("Internal server error.");
        }
        return users;
    }

    public async findById(_id: string | MongooseTypes.ObjectId) {
        let user: any;
        try {
            user = await this.userModel.findOne({
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
        } catch (ex) {
            Logger.error(ex);
            throw new InternalServerErrorException("Internal server error.");
        }
        if(!user) throw new NotFoundException('User not found.');
        return user;
    }

    public async findByEmail(email: string) {
        let user: any;
        try {
            user = await this.userModel.findOne({
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
        } catch (ex) {
            Logger.error(ex);
            throw new InternalServerErrorException("Internal server error.");
        }
        if(!user) throw new NotFoundException('User not found.');
        return user;
    }

    public async isEmailTaken(email :string): Promise<boolean> {
        let user: any;
        try {
            user = await this.userModel.findOne({ email, deleted: false });
        } catch (ex) {
            Logger.error(ex);
            throw new InternalServerErrorException("Internal server error.");
        }
        if(user) return true;
        return false;
    }

    public async create(user: Partial<UserInterface>) {
        let newUser: any;
        try {
            newUser = await this.userModel.create(user);
        } catch (ex) {
            Logger.error(ex);
            throw new InternalServerErrorException("Internal server error.");
        }
        return await this.findById(newUser._id);
    }

    public async removeById(id: string | MongooseTypes.ObjectId) {
        const user = await this.findById(id);
        user.deleted = true;
        try {
            await user.save();
        } catch (ex) {
            Logger.error(ex);
            throw new InternalServerErrorException("Internal server error.");
        }
        const { _id, firstName, lastName, email, roles } = user;
        return { _id, firstName, lastName, email, roles };
    }

    public async changePasswordById(_id: string | MongooseTypes.ObjectId, newPassword: string) {
        const user = await this.findById(_id);
        user.password = newPassword;
        try {
            await user.save();
        } catch (ex) {
            Logger.error(ex);
            throw new InternalServerErrorException("Internal server error.");
        }
        return await this.findById(_id);
    }

    public async updateHashedRt(_id: string | MongooseTypes.ObjectId, newHashedRT: string) {
        const user = await this.findById(_id);
        user.hashedRt = newHashedRT;
        try {
            await user.save();
        } catch (ex) {
            Logger.error(ex);
            throw new InternalServerErrorException("Internal server error.");
        }
        return await this.findById(_id);
    }

    public async updateRoles(_id: string | MongooseTypes.ObjectId, newRoles: Role[]) {
        const user = await this.findById(_id);
        user.roles = newRoles;
        try {
            await user.save();
        } catch (ex) {
            Logger.error(ex);
            throw new InternalServerErrorException("Internal server error.");
        }
        return await this.findById(_id);
    }
}