const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || "your-merchant-id";
const ZARINPAL_BASE = process.env.ZARINPAL_SANDBOX
  ? "https://sandbox.zarinpal.com/pg/v4"
  : "https://payment.zarinpal.com/pg/v4";

export interface ZarinpalRequestResult {
  authority: string;
  paymentUrl: string;
}

export async function zarinpalRequestPayment(params: {
  amount: number;
  description: string;
  email?: string;
  mobile?: string;
}): Promise<ZarinpalRequestResult> {
  const callbackUrl = `${process.env.BASE_URL}/api/payment/callback`;
  const body = {
    merchant_id: MERCHANT_ID,
    amount: params.amount,
    callback_url: callbackUrl,
    description: params.description,
    metadata: {
      email: params.email,
      mobile: params.mobile,
      order_id: params.description,
    },
  };

  const response = await fetch(`${ZARINPAL_BASE}/payment/request.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.data || result.data.code !== 100 || !result.data.authority) {
    throw new Error(
      result.data?.message || "خطا در اتصال به درگاه پرداخت"
    );
  }

  return {
    authority: result.data.authority,
    paymentUrl: `${ZARINPAL_BASE.replace("/pg/v4", "")}/pg/StartPay/${result.data.authority}`,
  };
}

export async function zarinpalVerifyPayment(params: {
  amount: number;
  authority: string;
}): Promise<{ refId: string | null; cardPan: string | null }> {
  const body = {
    merchant_id: MERCHANT_ID,
    amount: params.amount,
    authority: params.authority,
  };

  const response = await fetch(`${ZARINPAL_BASE}/payment/verify.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.data || result.data.code !== 100) {
    throw new Error(result.data?.message || "پرداخت تأیید نشد");
  }

  return {
    refId: result.data.ref_id || null,
    cardPan: result.data.card_pan || null,
  };
}