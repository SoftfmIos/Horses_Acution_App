export const BOARDING_PRICE_KINDS = [
  "boarding",
  "boarding_food",
  "boarding_full",
  "boarding_medical",
];
export const isBoardingPrice = (plan) =>
  BOARDING_PRICE_KINDS.includes(plan?.kind);
