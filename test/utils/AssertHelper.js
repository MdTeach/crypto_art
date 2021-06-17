const assert = require('assert');

const wei_2_eth = Math.pow(10, -18);
const epsilon = Math.pow(10, -8);
const ETHER = Math.pow(10, 18);

const AssertNearlyEqual = (v1, v2) => {
  v1 = v1 * wei_2_eth;
  v2 = v2 * wei_2_eth;
  console.log('v1 was', v1);
  console.log('v2 was', v2);
  const abs = Math.abs(v1 - v2);
  return assert(abs < epsilon, `${v1} and ${v2} ammt not same`);
};

const RemaningPriceAssert = (bal1, bal2, cost, gas) => {
  buyer_bal1 = parseInt(bal1) / ETHER;
  buyer_bal2 = parseInt(bal2) / ETHER;
  selling_price = parseInt(cost) / ETHER;
  gasFee = parseInt(gas) / ETHER;

  const abs = Math.abs(buyer_bal1 - buyer_bal2 - selling_price - gasFee);
  return assert(
    abs < epsilon,
    `Buyer balance not deducted proprly, ${buyer_bal2} and ${
      buyer_bal2 - selling_price - gasFee
    } ammt not same at the given epsilon ${epsilon}`,
  );
};

module.exports.AssertNearlyEqual = AssertNearlyEqual;
module.exports.RemaningPriceAssert = RemaningPriceAssert;
