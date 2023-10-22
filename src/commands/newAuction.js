const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const newAuction = require("../../prisma/scripts/newAuction");
const getActiveAuction = require("../../prisma/scripts/getActiveAuction");

module.exports = {
  data: require("./commandBuilders/newAuction"),
  async execute(interaction) {
    try {
      const isActiveAuction = await getActiveAuction();
      if (isActiveAuction.length !== 0) throw "1";
      if (!isActiveAuction) throw "2";

      const title = interaction.options.getString("제목");
      const desc = interaction.options.getString("설명");
      const price = interaction.options.getInteger("시작가격");
      const endsAt = interaction.options.getString("종료일시");
      const image = interaction.options.getAttachment("사진");
      const bidPrice = interaction.options.getInteger("입찰단위");
      let bidprice = bidPrice ? bidPrice : 5000;

      if (endsAt.length !== 12)
        return await interaction.reply({
          ephemeral: true,
          content: "날짜 형식을 참고해서 다시 입력하세요.",
        });

      // if (price % 5000 !== 0)
      //   return await interaction.reply({
      //     ephemeral: true,
      //     content: "가격은 5000원 단위로 설정해야 합니다.",
      //   });

      const endYear = Number(endsAt.substr(0, 4));
      const endMonth = Number(endsAt.substr(4, 2)) - 1;
      const endDate = Number(endsAt.substr(6, 2));
      const endHour = Number(endsAt.substr(8, 2));
      const endMinute = Number(endsAt.substr(10, 2));

      const startTimeUnixTimestamp = Math.floor(new Date().getTime() / 1000);
      const endTime = new Date(endYear, endMonth, endDate, endHour, endMinute);
      const endTimeUnixTimestamp = Math.floor(endTime.getTime() / 1000);
      if (startTimeUnixTimestamp >= endTimeUnixTimestamp) {
        return await interaction.reply({
          ephemeral: true,
          content: `현재시간보다 더 빠른 시간을 종료시간으로 지정할 수 없습니다.`,
        });
      }

      const newAuc = await newAuction(
        title,
        desc,
        price,
        String(startTimeUnixTimestamp),
        String(endTimeUnixTimestamp),
        interaction.channel.id,
        bidprice
      );
      if (!newAuc) throw "2";

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(newAuc.title)
        .setDescription("# " + newAuc.description)
        .addFields(
          { name: "경매ID", value: `#${newAuc.id}` },
          { name: "시작가격", value: String(price) + "₩", inline: true },
          { name: "입찰단위가격", value: String(bidprice) + "₩", inline: true },
          {
            name: "시작시간",
            value: `<t:${startTimeUnixTimestamp}>`,
          },
          { name: "종료시간", value: `<t:${endTimeUnixTimestamp}>` }
        );

      const bidButton = new ButtonBuilder()
        .setCustomId("first_bid")
        .setLabel("첫 입찰 하기")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(bidButton);

      let files = [];
      if (image) files.push(image);
      await interaction.reply({
        content: `@everyone\n 새로운 경매가 시작되었습니다!`,
        embeds: [embed],
        components: [row],
        files,
      });
    } catch (e) {
      let errMsg = "";
      switch (e) {
        case "1":
          errMsg = " : 이미 진행중인 경매가 있습니다.";
          break;
        case "2":
          errMsg = " : DB통신에 실패했습니다.";
          break;
      }
      return await interaction.reply({
        ephemeral: true,
        content: "경매 생성에 실패했습니다" + errMsg,
      });
    }
  },
};
