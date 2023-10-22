const prefix = require("./prefixs.json");
const subjects = require("./subjects.json");

module.exports = function () {
  const prefixIDX = Math.floor(Math.random() * prefix.length);
  const subjectsIDX = Math.floor(Math.random() * subjects.length);
  return `${prefix[prefixIDX]} ${subjects[subjectsIDX]}`;
};
