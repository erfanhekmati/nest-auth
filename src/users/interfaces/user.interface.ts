import { Role } from "../enums/role.enum";

export interface UserInterface {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    hashedRt: string;
    roles: Role[];
}