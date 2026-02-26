import type { FiatCurrency } from "./types";

export const FEE_RATE = 0.001; // 0.1%
export const FIXED_FEE_BOB = 100; // 100 Bs
const FIXED_FEE_MIN_BOB = 10_000;
const FIXED_FEE_MAX_BOB = 100_000;
export const MIN_DEPOSIT_BOB = 10_000;

export function parseMoney(input: string): number {
  const normalized = input.replace(",", ".").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

export type DepositFees = {
  amountInBobEquivalent: number;
  meetsMinimum: boolean;
  qualifiesForFixedFee: boolean;
  serviceFee: number;
  totalToPay: number;
  receiveBOBH: number;
};

export function calcDepositFees(
  amountNum: number,
  isValidAmount: boolean,
  selectedCurrency: FiatCurrency,
  penToBobRate: number | null
): DepositFees {
  if (!isValidAmount) {
    return {
      amountInBobEquivalent: 0,
      meetsMinimum: false,
      qualifiesForFixedFee: false,
      serviceFee: 0,
      totalToPay: 0,
      receiveBOBH: 0,
    };
  }

  const amountInBobEquivalent =
    selectedCurrency === "BOB"
      ? amountNum
      : penToBobRate
      ? amountNum * penToBobRate
      : 0;

  const meetsMinimum = amountInBobEquivalent >= MIN_DEPOSIT_BOB;
  const qualifiesForFixedFee =
    amountInBobEquivalent >= FIXED_FEE_MIN_BOB && amountInBobEquivalent < FIXED_FEE_MAX_BOB;

  let serviceFee = 0;
  if (meetsMinimum) {
    if (qualifiesForFixedFee) {
      serviceFee =
        selectedCurrency === "PEN" && penToBobRate
          ? FIXED_FEE_BOB / penToBobRate
          : FIXED_FEE_BOB;
    } else {
      serviceFee = amountNum * FEE_RATE;
    }
  }

  const receiveBOBH =
    selectedCurrency === "BOB"
      ? amountNum
      : penToBobRate
      ? amountNum * penToBobRate
      : 0;

  return {
    amountInBobEquivalent,
    meetsMinimum,
    qualifiesForFixedFee,
    serviceFee,
    totalToPay: amountNum + serviceFee,
    receiveBOBH,
  };
}
