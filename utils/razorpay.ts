import { loadScript } from './load-script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpay = async () => {
  return await loadScript('https://checkout.razorpay.com/v1/checkout.js');
};

export const initializeRazorpayCheckout = async ({
  amount,
  orderId,
  currency = 'INR',
  name = 'Campus Dabba',
  description = 'Food Order Payment',
  prefillEmail,
  prefillContact,
  theme = { color: '#F59E0B' },
  onSuccess,
}: {
  amount: number;
  orderId: string;
  currency?: string;
  name?: string;
  description?: string;
  prefillEmail?: string;
  prefillContact?: string;
  theme?: { color: string };
  onSuccess?: (response: any) => void;
}) => {
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: amount * 100, // Razorpay expects amount in paise
    currency,
    name,
    description,
    order_id: orderId,
    handler: function (response: any) {
      // Handle successful payment
      console.log('Payment successful:', response);
      if (onSuccess) {
        onSuccess(response);
      }
    },
    modal: {
      ondismiss: function() {
        console.log('Checkout form closed');
      },
    },
    prefill: {
      email: prefillEmail,
      contact: prefillContact,
    },
    theme,
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
  
  return new Promise((resolve, reject) => {
    razorpay.on('payment.success', resolve);
    razorpay.on('payment.error', reject);
  });
}; 