
const str =
  "({1133} OR {1112} OR {2011} OR ({1112} WITH {2011})) AND {1122} AND {2012} AND ({2013} OR {2000})";
// expected result = {
//   and: [
//     { or: [1133, 1112, 2011, { with: [1112, 2011] }] },
//     1122,
//     2012,
//     { or: [2013, 2000] },
//   ],
// };
const output = {};

function recursive(arg, index, first = true) {
  let startsNested = false;
  let times = 0;

  if (first && arg.charAt(0) === "(") {
    startsNested = true;
    times = endOfParentheses(arg);
  }

  const sep = startsNested
    ? arg.slice(times, times + 10).match(/\s[a-z]+\s/i)[0]
    : arg.match(/\s[a-z]+\s/i)[0];

  const sepProp = sep.trim().toLowerCase();

  const arr = arg.split(sep);

  if (first) {
    output[sepProp] = arr;
  }

  arr.forEach((element, index) => {
    if (/[a-z]/i.test(element)) {
      const [cArr, cSepProp, cIndex] = recursive(element, index, false);
      const res = {
        [cSepProp]: cArr.map((elm) => {
          if (typeof elm !== "object") {
            return parseInt(elm.replace(/[^\d]/g, ""));
          } else {
            return elm;
          }
        }),
      };
      arr[cIndex] = res;
    } else if (first) {
      output[sepProp][index] = parseInt(element.replace(/[^\d]/g, ""));
    }
  });
  if (first) {
    return output;
  } else {
    return [arr, sepProp, index];
  }
};

function endOfParentheses(str, times = 0) {
  let n = 0;
  do {
    if (str.charAt(times) === "(") {
      n++;
    } else if (str.charAt(times) === ")") {
      n--;
    }

    if (n === 0) {
      break;
    }
    times++;
  } while (times < str.length);
  return times;
}

console.log(JSON.stringify(recursive(str)));
