export interface IFlutterwavePayment {
  card_number?: string;
  cvv?: string;
  expiry_month?: string;
  expiry_year?: string;
  currency?: string;
  amount?: string;
  fullname?: string;
  email?: string;
  tx_ref?: string;
  redirect_url?: string;
  meta?: any;
}

interface IData {
  card_number?: string;
  cvv?: string;
  expiry_month?: string;
  expiry_year?: string;
  currency?: string;
  amount?: string;
  fullname?: string;
  email?: string;
  tx_ref?: string;
  redirect_url?: string;
  meta?: any;
}
