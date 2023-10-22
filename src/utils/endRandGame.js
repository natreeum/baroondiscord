const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async function endRandGame(randGameId) {
  const gameData = await prisma.randGame.findUnique({
    where: { id: randGameId },
  });
  if (!gameData) return { code: "noGame" };

  if (!gameData.inProgress) return { code: "alreadyEnd" };

  const updateRandGameStatusRes = await prisma.randGame.update({
    where: { id: randGameId },
    data: { inProgress: false },
  });
  if (!updateRandGameStatusRes) return { code: "dbErr" };

  const randGamers = await prisma.randGamers.findMany({
    where: { gameId: randGameId },
  });
  if (randGamers.length === 0) return { code: "noGamer" };

  const winnerIdx = Math.floor(Math.random() * randGamers.length);
  return { code: "success", data: randGamers[winnerIdx] };
};
