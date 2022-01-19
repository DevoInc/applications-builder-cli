const numbers = require('./numbers');

/**
 * Get the current datetime string
 * @return {string} - Current datetime string in format: YYYYMMDDHHmm
 */
function getDate() {
  let d = new Date();
  let datetime =
    '' +
    d.getFullYear() +
    numbers.leftPad(d.getMonth() + 1, 2) +
    numbers.leftPad(d.getDate(), 2) +
    numbers.leftPad(d.getHours(), 2) +
    numbers.leftPad(d.getMinutes(), 2);
  return datetime;
}

module.exports = {
  getDate,
};
