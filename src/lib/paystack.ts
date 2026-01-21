import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

function checkKey() {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not defined");
  }
}

interface InitializePaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface VerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    metadata: unknown;
    paid_at?: string;
  };
}

export async function initializePayment(email: string, amount: number, orderId: string) {
  checkKey();
  const params = {
    email,
    amount: amount * 100,
    reference: orderId,
    callback_url: `${process.env.NEXTAUTH_URL}/orders/${orderId}/verify`,
    metadata: {
      orderId,
      custom_fields: [
        {
          display_name: "Order ID",
          variable_name: "order_id",
          value: orderId,
        },
      ],
    },
  };

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Paystack initialization failed: ${response.statusText}`);
  }

  const data = (await response.json()) as InitializePaymentResponse;
  return data;
}

export async function verifyTransaction(reference: string) {
  checkKey();
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Paystack verification failed: ${response.statusText}`);
  }

  const data = (await response.json()) as VerifyPaymentResponse;
  return data;
}

export function verifyWebhookSignature(signature: string, payload: unknown) {
  checkKey();
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest("hex");
  
  return hash === signature;
}
