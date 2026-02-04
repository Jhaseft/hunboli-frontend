import axios from "axios";

type KycGateCode = "KYC_REQUIRED" | "ACCOUNT_NOT_VERIFIED";

const KYC_ACTIONS: Record<KycGateCode, { message: string; href: string }> = {
  KYC_REQUIRED: {
    message: "Debes completar tu KYC para continuar.",
    href: "/dashboard/kyc",
  },
  ACCOUNT_NOT_VERIFIED: {
    message: "Debes verificar tu cuenta para continuar.",
    href: "/dashboard/verify-account",
  },
};

function getAction(code?: string, message?: unknown) {
  if (code === "KYC_REQUIRED" || code === "ACCOUNT_NOT_VERIFIED") {
    return KYC_ACTIONS[code];
  }

  if (!message) return null;

  const messages = Array.isArray(message) ? message : [message];
  const normalized = messages
    .map((item) => (typeof item === "string" ? item : ""))
    .filter(Boolean);

  for (const text of normalized) {
    if (text === "KYC_REQUIRED") return KYC_ACTIONS.KYC_REQUIRED;
    if (text === "ACCOUNT_NOT_VERIFIED") return KYC_ACTIONS.ACCOUNT_NOT_VERIFIED;

    const lower = text.toLowerCase();
    if (lower.includes("debes completar la verificación kyc")) {
      return KYC_ACTIONS.KYC_REQUIRED;
    }
    if (lower.includes("debes realizar el proceso de verificacion")) {
      return KYC_ACTIONS.ACCOUNT_NOT_VERIFIED;
    }
  }

  return null;
}

export function handleKycGateResponse(status: number, data: any): boolean {
  if (status !== 403) return false;
  const action = getAction(data?.code, data?.message);
  if (!action) return false;

  alert(`${action.message} Ve a: ${action.href}`);
  if (typeof window !== "undefined") {
    window.location.assign(action.href);
  }
  return true;
}

export function handleKycGateAxiosError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  const code = (error.response?.data as any)?.code;
  const message = (error.response?.data as any)?.message;
  if (status !== 403) return false;
  const action = getAction(code, message);
  if (!action) return false;

  alert(`${action.message} Ve a: ${action.href}`);
  if (typeof window !== "undefined") {
    window.location.assign(action.href);
  }
  return true;
}
