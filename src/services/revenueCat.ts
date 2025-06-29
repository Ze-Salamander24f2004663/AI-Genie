// RevenueCat Monetization Service
export interface PurchasePackage {
  identifier: string;
  packageType: string;
  product: {
    identifier: string;
    description: string;
    title: string;
    price: string;
    priceString: string;
    currencyCode: string;
  };
}

export interface CustomerInfo {
  originalAppUserId: string;
  allPurchaseDates: Record<string, string>;
  activeSubscriptions: string[];
  allExpirationDates: Record<string, string>;
  entitlements: {
    active: Record<string, any>;
    all: Record<string, any>;
  };
}

export class RevenueCatService {
  private apiKey: string;
  private baseUrl = 'https://api.revenuecat.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getOfferings(): Promise<PurchasePackage[]> {
    try {
      // Mock offerings for demo
      return [
        {
          identifier: 'premium_monthly',
          packageType: 'MONTHLY',
          product: {
            identifier: 'ai_genie_premium_monthly',
            description: 'Unlock unlimited AI conversations, voice responses, and premium features',
            title: 'AI Genie Premium Monthly',
            price: '9.99',
            priceString: '$9.99',
            currencyCode: 'USD',
          },
        },
        {
          identifier: 'premium_yearly',
          packageType: 'ANNUAL',
          product: {
            identifier: 'ai_genie_premium_yearly',
            description: 'Best value! Full access to all premium features',
            title: 'AI Genie Premium Yearly',
            price: '99.99',
            priceString: '$99.99',
            currencyCode: 'USD',
          },
        },
      ];
    } catch (error) {
      console.error('Failed to get offerings:', error);
      throw error;
    }
  }

  async purchasePackage(packageIdentifier: string): Promise<CustomerInfo> {
    try {
      // Mock purchase for demo
      console.log('Processing purchase for:', packageIdentifier);
      
      // Simulate successful purchase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const customerInfo: CustomerInfo = {
        originalAppUserId: 'user_' + Date.now(),
        allPurchaseDates: {
          [packageIdentifier]: new Date().toISOString(),
        },
        activeSubscriptions: [packageIdentifier],
        allExpirationDates: {
          [packageIdentifier]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        entitlements: {
          active: {
            premium: {
              identifier: 'premium',
              isActive: true,
              willRenew: true,
              productIdentifier: packageIdentifier,
            },
          },
          all: {},
        },
      };

      // Store purchase info locally for demo
      localStorage.setItem('revenuecat_customer_info', JSON.stringify(customerInfo));
      
      return customerInfo;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      const stored = localStorage.getItem('revenuecat_customer_info');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) {
        throw new Error('No purchases to restore');
      }
      return customerInfo;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }
}