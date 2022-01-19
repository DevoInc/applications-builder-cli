module.exports = {
  /**
   * Padding with string
   * @param {number} n - Number to pad
   * @param {number} width - Size of the entire result
   * @param {string} z - The string to use in padding
   * @return {string} - Padded number
   */
  leftPad(n, width, z = 0) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  },
};
