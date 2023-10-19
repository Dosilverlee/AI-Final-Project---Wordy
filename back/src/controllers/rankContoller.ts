import { Request, Response } from "express";
import rankService from "../services/rankService";
import { UserDto } from "../dtos/userDto";

async function rankController(req: Request, res: Response) {
  const userId = req.params.userId : UserDto.id; ????

  try {
    const rankingChange = await rankService.rankService(userId);
    res.json(rankingChange);
  } catch (error) {
    console.error("랭킹을 불러올 수 없습니다.", error);
    res.status(500).json({ error: "랭킹 변화 조회 오류" });
  }
}

export { rankController };
