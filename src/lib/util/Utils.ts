export class Utils {
  static isNumber(n: any) {
    return !isNaN(n) && !isNaN(parseFloat(n));
  }
  /**
   * @param {number} milliseconds
   * @param {string} format A string describing how to format the resulting timestamp. Following template characters are supported:
   *                        - `D|H|M|S`: output the corresponding value following the unit suffix (`d|h|m|s`)
   *                        - `d|h|m|s`: output the corresponding values only as numbers
   *                        - `!<templateCharacter>`: forces the value of the template character to be present in the string. If this prefix is not set, empty values will be omitted. Omitting a character will also omit whatever is right next to it, assuming it is the separator. This is lazy but all we need.
   * @returns {string}
   */
  static prettifyMS(milliseconds: number, format="D H M S") {
    const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

    const parsed = {
      days: roundTowardsZero(milliseconds / 86400000),
      hours: roundTowardsZero(milliseconds / 3600000) % 24,
      minutes: roundTowardsZero(milliseconds / 60000) % 60,
      seconds: roundTowardsZero(milliseconds / 1000) % 60,
      milliseconds: roundTowardsZero(milliseconds) % 1000,
      microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
      nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000
    };
    const units = {
      days: "d",
      hours: "h",
      minutes: "m",
      seconds: "s"
    };

    var result = format;
    var force = false;
    let i = 0;
    while (i < result.length) {
      const char = result.charAt(i);
      if (!["d", "m", "y", "h", "m", "s", "!"].includes(char.toLowerCase())) {
        i++;
        continue;
      }
      if (char === "!") {
        force = true;
        i++;
        continue;
      }
      const uppercase = char.charCodeAt(0) < 0x61; // lowercase a is 0x61
      var value;
      var unit;
      switch (char.toLowerCase()) {
        case "d":
          value = parsed.days;
          unit = units.days;
          break;
        case "h":
          value = parsed.hours;
          unit = units.hours;
          break;
        case "m":
          value = parsed.minutes;
          unit = units.minutes;
          break;
        case "s":
          value = parsed.seconds;
          unit = units.seconds;
          break;
        default:
          value = 0;
      }
      value = (value < 10) ? "0" + value : "" + value; // TODO: add a way to disable padding
      const addition = value + ((uppercase) ? unit : "");
      if (value === "00" && !force) {
        result = result.slice(0, i) + result.slice(Math.min(i + 2, result.length));
        continue;
      }
      const start = (force) ? i - 1 : i;
      const end = (force) ? start + 2 : start + 1;
      result = result.slice(0, start) + addition + result.slice(end);
      i += addition.length - (+force);
    }
    return result.trim();
  }
  /**
   * Checks wether a string is valid JSON
   * @param {string} str
   * @returns
   */
  static isJSON(str: string) {
    try {
      JSON.parse(str);
    } catch (_e) {
      return false;
    }
    return true;
  }
  /**
   * Shuffles an array, should be in-place. Array is returned anyways.
   */
  static shuffleArr<T>(a: T[]) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
  /**
   * Generate a random id. I do not guarantee uniqueness in all cases, it should be fine however (Date + random).
   * @returns {string}
   */
  static uid() {
    return (new Date().valueOf().toString(36) + Math.random().toString(36).substr(2)).toUpperCase();
  }
}
