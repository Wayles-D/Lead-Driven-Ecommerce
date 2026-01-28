import * as SibApiV3Sdk from "@getbrevo/brevo";
import { formatCurrency } from "./utils";
import { ApiService } from "./api";

// Brevo Configuration
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const apiKey = process.env.BREVO_API_KEY || "";

if (apiKey) {
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);
}

const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "no-reply@lead-driven.com";
const SENDER_NAME = "OML Soles";

/**
 * Base email sending function
 */
async function sendEmail(to: string, subject: string, htmlContent: string) {
  if (!apiKey) {
    console.warn("⚠️ BREVO_API_KEY not configured. Email suppressed:", { to, subject });
    return;
  }

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
  sendSmtpEmail.to = [{ email: to }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    // Do not throw - email failure should not block the app
  }
}

/**
 * Email Templates & Triggers
 */
/**
 * Production-ready HTML Email Wrapper
 */
const getHtmlWrapper = (title: string, content: string) => `
  <div style="background-color: #f6f6f6; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1a1a; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <!-- Header -->
      <div style="background-color: #000000; padding: 40px; text-align: center;">
        <img src="https://res.cloudinary.com/dmb5ggmvg/image/upload/v1765226721/Brown_and_Beige_Modern_Aesthetic_Fashion_Store_Design_Logo_2_ladbpd.png" alt="OML Soles" style="height: 60px; width: auto;" />
      </div>
      
      <!-- Content -->
      <div style="padding: 40px;">
        <h2 style="margin-top: 0; font-size: 28px; font-weight: 900; tracking-tight: -0.5px; line-height: 1.2; color: #000000;">${title}</h2>
        <div style="font-size: 16px; color: #444444;">
          ${content}
        </div>
      </div>
      
      <!-- Footer -->
      <div style="padding: 40px; background-color: #fafafa; border-top: 1px solid #eeeeee; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">...the soft feel your feet needs</p>
        <p style="margin: 10px 0 0; font-size: 14px; font-weight: 500;">
          <a href="${process.env.NEXTAUTH_URL}" style="color: #000000; text-decoration: none;">Visit Website</a>
        </p>
      </div>
    </div>
    <div style="max-width: 600px; margin: 20px auto; text-align: center;">
      <p style="font-size: 11px; color: #aaaaaa;">&copy; ${new Date().getFullYear()} OML Soles. All rights reserved.</p>
    </div>
  </div>
`;

const getButton = (text: string, url: string) => `
  <div style="margin: 35px 0;">
    <a href="${url}" style="background-color: #000000; color: #ffffff; padding: 18px 32px; text-decoration: none; border-radius: 14px; font-weight: 700; font-size: 16px; display: inline-block;">${text}</a>
  </div>
`;

/**
 * Email Templates & Triggers
 */
export const EmailService = {
  /**
   * 1. Welcome Email
   */
  sendWelcomeEmail: async (to: string, name: string) => {
    const firstName = name.split(' ')[0];
    const subject = `Welcome to the Collection, ${firstName}`;
    const content = `
      <p>Welcome to OML Soles, ${firstName}. We're thrilled to have you join our community of handcrafted enthusiasts.</p>
      <p>Your account is now active. You can explore our latest collections, track your orders, and manage your preferences directly from your dashboard.</p>
      ${getButton("Start Shopping", `${process.env.NEXTAUTH_URL}/products`)}
      <p style="margin-top: 30px; font-size: 14px; font-style: italic; color: #888;">"Quality is not an act, it is a habit."</p>
    `;
    await sendEmail(to, subject, getHtmlWrapper(`Hello, ${firstName}`, content));
  },

  /**
   * 2. Order Confirmation
   */
  sendOrderConfirmation: async (to: string, orderId: string, total: number) => {
    const shortId = orderId.slice(0, 8);
    const subject = `Order Confirmed - #${shortId}`;
    const whatsappLink = ApiService.whatsapp.getLink(ApiService.whatsapp.getOrderConfirmationMessage("Customer", orderId));
    
    const content = `
      <p>Your order <strong>#${shortId}</strong> has been successfully received.</p>
      
      <div style="background-color: #f9f9f9; padding: 25px; border-radius: 16px; margin: 25px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size: 14px; color: #666; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Amount Paid</td>
            <td style="text-align: right; font-size: 20px; font-weight: 900; color: #000;">${formatCurrency(total)}</td>
          </tr>
        </table>
      </div>

      <p style="color: #000; font-weight: 600;">To begin crafting your custom footwear, our team must receive your order details directly on WhatsApp. This ensures faster processing and prevents delays.</p>
      
      ${getButton("Send Order to WhatsApp", whatsappLink)}

      <p style="font-size: 13px; color: #666; background: #fff3e0; padding: 12px; border-radius: 8px; border: 1px solid #ffe0b2;">
        <strong>Note:</strong> Orders are processed only after WhatsApp confirmation.
      </p>
    `;
    await sendEmail(to, subject, getHtmlWrapper("Order Confirmed", content));
  },

  /**
   * 3. Password Reset
   */
  sendPasswordResetEmail: async (to: string, resetLink: string) => {
    const subject = "Restore Access to Your Account";
    const content = `
      <p>A request was made to reset the password for your OML Soles account.</p>
      <p>If you did not make this request, you can safely ignore this email. Your account remains secure. If you did, click the button below to choose a new password.</p>
      ${getButton("Reset Security Credentials", resetLink)}
      <p style="font-size: 12px; color: #999;">This link will remain active for the next 5 minutes.</p>
    `;
    await sendEmail(to, subject, getHtmlWrapper("Reset Password", content));
  },

  /**
   * 4. Fulfillment Status Update
   */
  sendFulfillmentUpdate: async (to: string, orderId: string, status: string) => {
    const shortId = orderId.slice(0, 8);
    const subject = `Order Update - #${shortId}`;
    const content = `
        <p>Your order <strong>#${shortId}</strong> fulfillment status has reached a new milestone.</p>
        <div style="background-color: #000; color: #fff; padding: 25px; border-radius: 16px; margin: 25px 0; text-align: center;">
            <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Current Status</p>
            <h3 style="margin: 5px 0 0; font-size: 24px; font-weight: 900;">${status}</h3>
        </div>
        <p>We are meticulously managing every step of the delivery process. Track your real-time progress on our dashboard.</p>
        ${getButton("Track Order", `${process.env.NEXTAUTH_URL}/orders`)}
    `;
    await sendEmail(to, subject, getHtmlWrapper("Delivery Update", content));
  }
};
