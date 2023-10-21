import { Request, Response, NextFunction } from "express";
import * as rankService from "../services/rankService";
import { User, Rank } from "@prisma/client";
import { UserDto } from "../dtos/userDto";

//todo 코드 스타일을 통일하는게 좋지 않을까요? 함수 표현식으로 통일하거나 클래스를 이용한 정적메서드 방식으로 통일하거나
// (현재 서버 아키텍쳐가 함수표현식을 사용한다는 전제하에 구현한 상태이고 어차피 정적메서드를 사용한다면 굳이 클래스를 사용할 필요가 있을까요?)

export const getUsersRankList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rankList = await rankService.getUsersRankList();
    res.status(200).json(rankList);
  } catch (e) {
    res.status(400).json(`${e}\n 유저 순위 목록을 가져올 수 없습니다.`);
    next(e);
  }
};

export const getUserRank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const rank = await rankService.getUserRank(user);
  } catch (e) {
    res.status(400).json(`${e}\n 유저의 랭킹을 가져올 수 없습니다.`);
    next(e);
  }
};

/** 유저 랭킹 변화 */
// export const getUserGapRank = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userGapRank = await rankService.getUserGapRank;
//     res.status(200).json(userGapRank);
//     console.log(userGapRank);
//   } catch (e) {
//     res.status(400).json(`${e}\n 유저 순위 목록을 가져올 수 없습니다.`);
//     next(e);
//   }
// };
