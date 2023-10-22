const { PrismaClient } = require("@prisma/client");
const endRandGame = require("./endRandGame");

const prisma = new PrismaClient();

module.exports = async function checkRandGame(client) {
  const curTime = new Date();
  const curYear = curTime.getFullYear();
  const curMonth = curTime.getMonth() + 1;
  const curDate = curTime.getDate();
  const curHour = curTime.getHours();
  const curMinute = curTime.getMinutes();

  const activeInProgressPassedGame = await prisma.randGame.findMany({
    where: {
      AND: [
        {
          end: { lte: `${curYear}${curMonth}${curDate}${curHour}${curMinute}` },
        },
        { inProgress: true },
      ],
    },
  });
  if (activeInProgressPassedGame.length === 0) return;

  for (let g of activeInProgressPassedGame) {
    const channel = await client.channels.fetch(g.channelId);
    const res = await endRandGame(g.id);
    const nothing = ["noGame", "alreadyEnd", "dbErr"];
    if (nothing.includes(res.code)) return;
    else if (res.code === "noGamer") {
      channel.send(`[#${g.id}]번 이벤트는 참여자 없이 종료되었습니다.`);
    } else if (res.code === "success") {
      channel.send(
        `[#${g.id}]번 이벤트의 당첨자는 <@${res.data.userId}>입니다!!`
      );
    }
  }
};
