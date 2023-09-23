import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { User } from "@prisma/client";

interface AuthenticatedRequest extends Request {
    user?: User;
    token?: string;
}

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    /**
     * #swagger.tags = ['Auth']
     * #swagger.summary = '회원가입'
     * #swagger.description = '이메일과 닉네임 중복 검사 후 회원가입'
     */
    try {
        const { email, password, name, nickname } = req.body;
        const { emailExists, nicknameExists } =
            await authService.signUpDuplicateCheck(email, nickname);
        if (emailExists)
            return res
                .status(409)
                .json({ message: "이미 존재하는 이메일입니다." });
        if (nicknameExists)
            return res
                .status(409)
                .json({ message: "이미 존재하는 닉네임입니다." });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await authService.createUser({
            email,
            name,
            nickname,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: `회원가입에 성공했습니다 :: ${newUser.nickname}`,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        /**
         * #swagger.tags = ['Auth']
         * #swagger.summary = '로그인'
         * #swagger.description = '로컬 로그인. 로그인 성공 시 JWT 발급'
         */
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user)
            return res
                .status(401)
                .json({ message: "유효하지 않은 사용자 정보입니다." });
        const loginUser = {
            token: authReq.token, // postman 편의성을 위해 추가
            user: authReq.user.name,
            nickname: authReq.user.nickname,
        };
        return res.cookie("token", authReq.token).status(200).json(loginUser);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const editUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    /**
     * #swagger.tags = ['Auth']
     * #swagger.summary = '유저 업데이트'
     * #swagger.description = '회원 정보 수정. 요청 받은 필드만 수정'
     * #swagger.security = [{
     *   "bearerAuth": []
     * }]
     */
    try {
        const userId = (req.user as User).id;
        const updatedData = req.body;
        const updatedUser = await authService.editUser(userId, updatedData);
        return res.status(201).json(updatedUser);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    /**
     * #swagger.tags = ['Auth']
     * #swagger.summary = '프로필'
     * #swagger.description = '유저 상세 정보'
     * #swagger.security = [{
     *   "bearerAuth": []
     * }]
     */
    try {
        const userId = (req.user as User).id;
        const user = await authService.getUserById(userId);
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as User).id;
        const deleteUser = authService.deleteUser(userId);
        res.status(204).json({ message: "회원 탈퇴가 진행됩니다." });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
