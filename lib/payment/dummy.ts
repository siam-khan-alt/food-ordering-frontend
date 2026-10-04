import type { PaymentStatus } from "@/types";

export interface DummyPaymentInput {
  orderId: string;
  amount: number;
  method?: "dummy" | "cod";
}

export interface DummyPaymentResult {
  success: boolean;
  transactionId: string;
  status: PaymentStatus;
}

export async function processDummyPayment(input: DummyPaymentInput): Promise<DummyPaymentResult> {
  await new Promise((r) => setTimeout(r, 1200));
  return {
    success: true,
    transactionId: `txn_mock_${input.orderId.slice(-8)}_${Date.now()}`,
    status: input.method === "cod" ? "pending" : "paid",
  };
}
