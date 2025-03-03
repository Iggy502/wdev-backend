import {Document} from 'mongoose';
import {UserRole} from "./auth.types";

export interface RefreshToken {
    token: string;
    deviceInfo: string;
    lastUsed: Date;
}

export interface PasswordResetToken {
    token: string;
    expires: Date;
}

export interface IUserBase {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    profilePicturePath?: string;
    passwordResetToken?: PasswordResetToken;
    roles: Array<UserRole>;
}

export interface IUserDocument extends IUserBase, Document {
    refreshTokens: RefreshToken[];

    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserCreate extends Omit<IUserBase, 'profilePicturePath' | 'roles'> {
    roles: Array<Exclude<UserRole, 'TEST'>> // User Test role is not allowed to be created
}

export interface IUserUpdate extends Partial<IUserBase> {

}

export interface IUserResponse extends Omit<IUserBase, 'password'> {
    id: string;
}