export type DepositStatus =
  | "PENDING"
  | "PROOF_SUBMITTED"
  | "NEED_CORRECTION"
  | "RATE_EXPIRED"
  | "APPROVED"
  | "REJECTED"
  | "MINTED"
  | "COMPLETED";

export type FiatCurrency = "BOB" | "PEN";

export type StatusFilter =
  | "PROOF_SUBMITTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "RATE_EXPIRED"
  | "MINTED"
  | "ALL";

export type AdminDepositItem = {
  id: string;
  referenceCode: string;
  currency: FiatCurrency;
  status: DepositStatus;
  isRateExpired: boolean;

  amount: string;
  totalAmount: string;
  expectedBOBH: string;

  rateUsed: string | null;
  rateSource: string | null;
  rateQuotedAt: string | null;
  rateExpiresAt: string | null;

  proofUrl: string | null;
  proofUploadedAt: string | null;
  proofFileName: string | null;
  proofMimeType: string | null;

  reviewNote: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;

  validatedById: string | null;
  validatedAt: string | null;

  safeTxHash: string | null;
  safeProposedAt: string | null;

  mintTxHash: string | null;
  mintedAt: string | null;

  createdAt: string;

  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    country: "BOLIVIA" | "PERU";
    kycStatus: string;
    walletAddress: string | null;
  };
};

export type AdminDepositsResponse = {
  items: AdminDepositItem[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
  filter: string;
};

// --- MyDeposits types ---

export type MyDepositItem = {
  id: string;
  referenceCode: string;
  currency: FiatCurrency;
  status: DepositStatus;

  amount: string;
  feeRate: string;
  serviceFee: string;
  totalAmount: string;
  expectedBOBH: string;

  rateUsed: string | null;
  rateSource: string | null;
  rateQuotedAt: string | null;
  rateExpiresAt: string | null;

  proofUrl: string | null;
  proofUploadedAt: string | null;
  proofFileName: string | null;
  proofMimeType: string | null;
  reviewNote: string | null;
  reviewedAt: string | null;

  validatedById: string | null;
  validatedAt: string | null;

  mintTxHash: string | null;
  mintedAt: string | null;

  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
};

export type MyDepositsResponse = {
  items: MyDepositItem[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
};

// --- DepositForm types ---

export type DepositInstructions = {
  title: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  note: string;
  cci?: string | null;
  qrImageUrl?: string | null;
  qrPublicId?: string | null;
};

export type DepositCreateResponse = {
  depositId: string;
  status: string;
  referenceCode: string;
  currency: FiatCurrency;
  amount: string;
  feeRate: string;
  serviceFee: string;
  totalAmount: string;
  rateUsed: string | null;
  rateSource: string | null;
  rateQuotedAt: string | null;
  rateExpiresAt: string | null;
  expectedBOBH: string;
  instructions: DepositInstructions;
};
