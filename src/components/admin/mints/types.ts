export type DepositStatus =
  | "PENDING"
  | "PROOF_SUBMITTED"
  | "NEED_CORRECTION"
  | "RATE_EXPIRED"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSED"
  | "FAILED"
  | "MINTED";

export type FiatCurrency = "BOB" | "PEN";

export type AdminMintDepositItem = {
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

export interface AdminDepositReviewCardProps {
  item: AdminMintDepositItem;
  actingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onOpenCorrection: (item: AdminMintDepositItem) => void;
  onProposeMint: (id: string) => void;
  onPreview: (item: AdminMintDepositItem) => void;
  onCopy: (label: string, value: string) => void;
}
