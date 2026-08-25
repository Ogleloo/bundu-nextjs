// ============================================================
// CONTACT DETAILS — single source of truth for the numbers we
// hand out when something goes wrong.
// Edit the numbers here if they change.
// ============================================================

export const ORDER_WHATSAPP = '27737155505';
export const ORDER_PHONE = '+27640746461';

const ORDER_MESSAGE = "Hi Bundu, I'd like to place an order.";

/** wa.me link pre-filled with an order message */
export const WHATSAPP_ORDER_URL =
  `https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(ORDER_MESSAGE)}`;
