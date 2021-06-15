const assert = require('assert');

const wei_2_eth = Math.pow(10, -18);
const epsilon = Math.pow(10, -8);

const AssertNearlyEqual = (v1, v2) => {
  v1 = v1 * wei_2_eth;
  v2 = v2 * wei_2_eth;
  console.log('v1 was', v1);
  console.log('v2 was', v2);
  const abs = Math.abs(v1 - v2);
  return assert(abs < epsilon, `${v1} and ${v2} ammt not same`);
};

module.exports = AssertNearlyEqual;
