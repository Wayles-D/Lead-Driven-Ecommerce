/**
 * WhatsApp Utility
 * 
 * Centralized logic for generating polished, pre-filled WhatsApp links.
 * All messages follow the brand's calm and confident voice.
 */

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "234XXXXXXXXXX"; // Fallback placeholder

export const WhatsAppService = {
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
};
