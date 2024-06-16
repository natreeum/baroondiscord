class role {
  constructor(id, name) {
    this.roleId = id;
    this.name = name;
  }
}

class roleMatching {
  constructor(r1Id, r2Id) {
    this.role1 = r1Id;
    this.role2 = r2Id;
  }
}

class ticketAmountForRoles {
  constructor(rId, amt) {
    (this.roleId = rId), (this.amount = amt);
  }
}
module.exports = {
  youtubeRoles: [
    new role("1224325541361090561", "Youtube Member: TTC타이거 1알"),
    new role("1224325541361090562", "Youtube Member: 흑축 10알"),
    new role("1224325541361090563", "Youtube Member: 흑축 20알"),
    new role("1224325541361090564", "Youtube Member: 흑축 30알"),
  ],
  manualRoles: [
    new role("1165529959251574966", "[M]TTC타이거 1알"),
    new role("1143585404973494353", "[M]흑축 10알"),
    new role("1143585456106262649", "[M]흑축 20알"),
    new role("1146659499856367746", "[M]흑축 30알"),
  ],
  matchedRole: [
    new roleMatching("1224325541361090561", "1165529959251574966"),
    new roleMatching("1224325541361090562", "1143585404973494353"),
    new roleMatching("1224325541361090563", "1143585456106262649"),
    new roleMatching("1224325541361090564", "1146659499856367746"),
  ],
  ticketsForRole: [
    new ticketAmountForRoles("1143585404973494353", 1),
    new ticketAmountForRoles("1143585456106262649", 2),
    new ticketAmountForRoles("1146659499856367746", 3),
  ],
};
