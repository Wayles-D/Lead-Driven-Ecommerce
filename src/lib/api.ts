import crypto from "crypto";

/**
 * API Service Module
 * Centralized service for all external API interactions (WhatsApp, Paystack, Cloudinary).
 */

// --- Configuration & Constants ---

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "234";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dur7drupx";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "OMLPRODUCTIMAGES";

// Check for required keys in server environment
const checkPaystackKey = () => {
  if (typeof window === "undefined" && !PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not defined");
  }
};

// --- Types ---

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

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

// --- API Service ---

export const ApiService = {
  /**
   * WhatsApp Service Logic
   */
  whatsapp: {
    /**
     * Generate a custom WhatsApp link with encoded message
     */
    getLink: (message: string) => {
      const encoded = encodeURIComponent(message);
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    },

    /**
     * Message: Product Inquiry
     */
    getProductInquiryMessage: (userName: string, productName: string, productId: string) => {
      return `Hello! I'm ${userName}. I'm interested in the ${productName} (ID: ${productId.slice(0, 6)}). Could you provide more details about it?`;
    },

    /**
     * Message: Order Confirmation (Post-Payment)
     */
    getOrderConfirmationMessage: (userName: string, orderId: string) => {
      return `Hi! My name is ${userName} and I just completed payment for Order #${orderId.slice(0, 8)}. I'd like to confirm it to prioritize fulfillment. Thanks!`;
    }
  },

  /**
   * Paystack Service Logic
   */
  paystack: {
    /**
     * Paystack static assets
     */
    assets: {
      badgeUrl: "https://checkout.paystack.com/images/paystack-badge.png",
    },

    /**
     * Initialize a Paystack transaction
     */
    initializePayment: async (email: string, amount: number, orderId: string) => {
      checkPaystackKey();
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

      return (await response.json()) as InitializePaymentResponse;
    },

    /**
     * Verify a Paystack transaction
     */
    verifyTransaction: async (reference: string) => {
      checkPaystackKey();
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Paystack verification failed: ${response.statusText}`);
      }

      return (await response.json()) as VerifyPaymentResponse;
    },

    /**
     * Verify Paystack Webhook signature (Server only)
     */
    verifyWebhookSignature: (signature: string, payload: unknown) => {
      checkPaystackKey();
      const hash = crypto
        .createHmac("sha512", PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(payload))
        .digest("hex");
      
      return hash === signature;
    }
  },

  /**
   * Cloudinary Service Logic
   */
  cloudinary: {
    /**
     * Upload an image to Cloudinary (Client side unsigned upload)
     */
    upload: async (file: File) => {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Cloudinary upload failed");
      }

      return (await response.json()) as CloudinaryUploadResponse;
    }
  },

  /**
   * Shared External Assets (Category placeholders, etc.)
   */
  assets: {
    hero: [
      {
        url: "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1753045322/Oml_hero_img_qfjpdy.avif",
        headline: "Handcrafted Luxury",
        subtext: "Experience the intentional comfort of footwear built to last and designed for you."
      },
      {
        url: "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1769154694/03db9648-f716-4942-8018-c938e041cf59.png",
        headline: "Made Just for You",
        subtext: "Every pair is meticulously handcrafted on demand with the finest premium materials."
      },
      {
        url: "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1769154779/6701851f-c066-4e7d-b3ca-c1230781c5ac.png",
        headline: "Quiet Luxury",
        subtext: "Craftsmanship that speaks for itself. Discover the soft feel your feet needs."
      }
    ],
    placeholders: {
      sandals: "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1769153116/d05f8553-346a-4c7b-8157-8feb797f7ae2.png",
      slides: "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1769152753/dc0f9f9e-7209-400d-b38e-3b36049da2fe.png",
      slippers: "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1764972050/9176554c-fe50-4561-8e55-842be195866e.png",
    }
  }
};
