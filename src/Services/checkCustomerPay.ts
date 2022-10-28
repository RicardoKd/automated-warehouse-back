/**
 * This method emulates the amount of money on customer's account.
 * It randoly determines if there are enough money.
 */
const checkCustomerPay = (): boolean => {
  return Boolean(Math.round(Math.random()));
};

export default checkCustomerPay;
