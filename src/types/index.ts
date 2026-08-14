import type { Enums, Tables, Views } from "./database";

export * from "./database";

/* ─── Aliases de domínio (legíveis, estáveis) ─────────────────────────────── */
export type Profile = Tables<"profiles">;
export type Wedding = Tables<"weddings">;
export type WeddingMember = Tables<"wedding_members">;
export type GiftCategory = Tables<"gift_categories">;
export type Gift = Tables<"gifts">;
export type GiftReservation = Tables<"gift_reservations">;
export type Contribution = Tables<"contributions">;
export type Rsvp = Tables<"rsvps">;
export type GuestbookMessage = Tables<"guestbook_messages">;
export type Notification = Tables<"notifications">;

export type GiftStats = Views<"gift_stats">;
export type WeddingFundStats = Views<"wedding_fund_stats">;

/* ─── Enums ────────────────────────────────────────────────────────────────── */
export type GiftStatus = Enums<"gift_status">;
export type ReservationStatus = Enums<"reservation_status">;
export type PaymentStatus = Enums<"payment_status">;
export type PaymentMethod = Enums<"payment_method">;
export type RsvpStatus = Enums<"rsvp_status">;
export type WeddingMemberRole = Enums<"wedding_member_role">;

/* ─── Composições úteis ───────────────────────────────────────────────────── */
export type GiftWithStats = Gift & {
  stats?: GiftStats | null;
  category?: GiftCategory | null;
};

/** Resultado da função get_wedding_dashboard_stats. */
export type DashboardStats = {
  gifts_total: number;
  gifts_reserved: number;
  gifts_received: number;
  total_raised: number;
  pending_amount: number;
  contributions_count: number;
  rsvp_confirmed: number;
  rsvp_declined: number;
  guests_expected: number;
  guestbook_pending: number;
};

/** Envelope padrão de retorno de Server Actions. */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
