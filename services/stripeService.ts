import { User } from '../types';

export const stripeService = {
  /**
   * Initiates the Stripe Checkout flow.
   * In a real app, this would redirect to a Stripe Payment Link or 
   * a Checkout Session URL created by your backend.
   */
  startCheckout: async (user: User): Promise<void> => {
    // Simulate API network latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ------------------------------------------------------------------
    // TO ENABLE REAL STRIPE:
    // 1. Create a Payment Link in Stripe Dashboard (Product -> Payment Link)
    // 2. Configure the "After payment" behavior to redirect to: 
    //    https://your-domain.com/?payment_success=true
    // 3. Uncomment the line below and replace the URL:
    // window.location.href = `https://buy.stripe.com/test_...?prefilled_email=${user.email}`;
    // ------------------------------------------------------------------

    // FOR DEMO ONLY:
    // We simulate a successful redirect back to the app with the success flag.
    const currentUrl = window.location.origin + window.location.pathname;
    const successUrl = `${currentUrl}?payment_success=true`;
    
    window.location.href = successUrl;
  },

  /**
   * Checks if the user just returned from a successful payment.
   */
  checkPaymentSuccess: (): boolean => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('payment_success') === 'true';
  },

  /**
   * Cleans up the URL parameters after processing.
   */
  clearPaymentParams: (): void => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.delete('payment_success');
    window.history.replaceState({}, '', url.toString());
  }
};