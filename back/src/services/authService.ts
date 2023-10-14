import { PrismaClient, User } from "@prisma/client";
import { sendMail } from "../utils/sendMail";
import * as authInterface from "../interfaces/authInterface";
import { plainToClass } from "class-transformer";
import { UserDto } from "../dtos/userDto";
import { KakaoClient } from "../passport/kakao";
import path from "path";
import fs from "fs";
import axios from 'axios';

const prisma = new PrismaClient();

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email: email },
  });
};

export const sendVerificationCode = async (email: string): Promise<void> => {
  const verificationCode = Math.floor(Math.random() * 1000000).toString();
  await sendMail(email, verificationCode);
  await prisma.verifiCode.create({
    data: {
      email,
      code: verificationCode,
    },
  });
  return;
};

export const verifyEmail = async (email: string, code: string): Promise<boolean> => {
  const verificationCode = await prisma.verifiCode.findUnique({
    where: { email },
  });
  if (!verificationCode) return false;
  if (verificationCode.code === code) {
    await prisma.verifiCode.delete({
      where: { email },
    });
    return true;
  } else return false;
};

export const getUserByNickname = async (nickname: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { nickname },
  });
};

export const signUpDuplicateCheck = async (
  email: string,
  nickname: string,
): Promise<authInterface.DuplicateCheckResult> => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nickname }],
    },
  });
  return {
    emailExists: user?.email === email,
    nicknameExists: user?.nickname === nickname,
  };
};

export const createUser = async (userData: authInterface.UserCreationData): Promise<UserDto> => {
  const createdUser = prisma.user.create({
    data: userData,
  });
  return plainToClass(UserDto, createdUser);
};

export const editUser = async (userId: number, updatedData: Partial<User>): Promise<UserDto> => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
  });
  if (!updatedUser) throw new Error("유저 정보를 찾을 수 없습니다.");

  return plainToClass(UserDto, updatedUser);
};

export const deleteUser = async (userId: number): Promise<null | UserDto> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (user?.profileImage)
    fs.unlinkSync(path.join(__dirname, "../../", "public", user.profileImage));
  await prisma.user.delete({
    where: { id: userId },
  });
  return plainToClass(UserDto, user);
};

export const oAuthKakaLogin = async() =>{
  
 const url = KakaoClient.getAuthCodeURL();
 const res = await axios.get(url);
 console.log('---------응답 테스트---------');
 console.log(res);
}
