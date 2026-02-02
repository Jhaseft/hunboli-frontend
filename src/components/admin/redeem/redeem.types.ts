export type Bank = {
  id: number;
  name: string;
  logo_url: string;
  country: string;
};

export type BankAccount = {
  id: string;
  userId: string;
  bankId: number;
  accountNumber: string;
  createdAt: string;
  updatedAt: string;
  bank: Bank;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  walletAddress: string;
  kycStatus: string;
};

export type Operation = {
  id: string;
  type: string;
  userId: string;
  currency: string;
  amount: string;
  feeRate: string;
  serviceFee: string;
  totalAmount: string;
  rateUsed: string;
  referenceCode: string;
  status: string;
  validatedById: string | null;
  validatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
  user: User;
};

export type RedeemRequest = {
  id: string;
  operationId: string;
  burnedBOBH: string; // Prisma Decimal → string
  fiatSent: string;   // Prisma Decimal → string
  bankAccountId: bigint;
  payoutTxRef: string | null;
  paidAt: string | null;
  logProofUrl?: string | null;
  proofUploadedAt?: string | null;
  cloudinaryPublicId?: string | null;
  operation: Operation;
  bankAccount: BankAccount;
};