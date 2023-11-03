import { PrismaClient } from "@prisma/client";
import { RankDto } from "../dtos/rankDto";
import { UserDto } from "../dtos/userDto";
import { plainToInstance } from "class-transformer";
import getPaginationParams from "../utils/getPaginationParams";
import cron from "node-cron";

const prisma = new PrismaClient();

//todo 페이징
/** 유저 학습 점수와 닉네임을 점수 내림차순으로 가져옴 */
export const getUsersRankList = async (page?: number, limit?: number): Promise<RankDto[]> => {
  const totalRankCount: number = await prisma.rank.count();
  const totalPages: number = Math.ceil(totalRankCount / (limit ?? 10));
  const offset: { skip: number; take: number } = getPaginationParams(page, limit);
  const rankList = await prisma.rank.findMany({
    orderBy: { score: "desc" },
    select: {
      userId: true,
      score: true,
      user: {
        select: { name: true, nickname: true, profileImage: true },
      },
    },
    ...offset,
  });

  return plainToInstance(
    RankDto,
    rankList.map((rankInfo, index) => ({
      ...rankInfo,
      rank: index + 1,
      currentPage: offset.skip + 1,
      totalPage: totalPages,
    })),
  );
};

/** 로그인한 유저의 등수와 점수 가져오기 */
export const getUserRank = async (id: number): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) throw new Error("유저를 찾을 수 없습니다.");

  const rank = await prisma.rank.findFirst({
    where: {
      userId: id,
    },
  });

  if (!rank) throw new Error("랭크 데이터를 찾을 수 없습니다.");

  // 조회할 유저 = user
  const users = await prisma.rank.findMany({
    orderBy: {
      score: "desc",
    },
    select: {
      userId: true,
      score: true,
      currentRank: true,
      user: {
        select: { name: true, nickname: true, profileImage: true },
      },
    },
  });

  const rankIndex = users.findIndex((item) => item.userId === id);

  return {
    rank: rankIndex + 1,
    score: rank.score,
  };
};

// /** 매일 6시에 유저의 이전 랭크를 저장함 */
// export const updateRankCron = () => {
//   cron.schedule("0 18 * * *", async () => {
//     const users = await prisma.rank.findMany({
//       select: {
//         userId: true,
//         currentRank: true,
//       },
//     });

//     for (const user of users) {
//       await prisma.rank.update({
//         where: { userId: user.userId },
//         data: { pastRank: user.currentRank },
//       });
//     }
//   });
// };

// pastRank - currentRank
export const getRankGap = async (id: number) => {
  const user = await prisma.rank.findFirst({
    where: {
      userId: id,
    },
  });

  if (user) {
    const pastRank = user.pastRank || 0;
    const currentRank = user.currentRank || 0;
    const rankGap = pastRank - currentRank;
    return { pastRank: pastRank, currentRank: currentRank, rankGep: rankGap };
  }
  return 0;
};
