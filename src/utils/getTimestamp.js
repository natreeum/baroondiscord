module.exports = function (endTime) {
  const timestamp = Math.floor(
    new Date(
      Number(endTime.substring(0, 4)),
      Number(endTime.substring(4, 6)) - 1,
      Number(endTime.substring(6, 8)),
      Number(endTime.substring(8, 10)),
      Number(endTime.substring(10, 12))
    ).getTime() / 1000
  );
  return timestamp;
};
