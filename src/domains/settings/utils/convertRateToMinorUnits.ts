export const convertRateToMinorUnits = (rate: string) => {
  const integerPart = rate.split(/[.,]/)[0];
  const decimalPart = rate.split(/[.,]/)[1] || "00";

  const normalizedDecimalPart = decimalPart.padEnd(2, "0");

  return parseInt(integerPart + normalizedDecimalPart);
};
