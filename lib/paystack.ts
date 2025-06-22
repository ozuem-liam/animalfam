interface PaystackInitializeResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    id: number
    domain: string
    status: string
    reference: string
    amount: number
    message: string | null
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: any
    log: any
    fees: number
    fees_split: any
    authorization: {
      authorization_code: string
      bin: string
      last4: string
      exp_month: string
      exp_year: string
      channel: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      reusable: boolean
      signature: string
      account_name: string | null
    }
    customer: {
      id: number
      first_name: string
      last_name: string
      email: string
      customer_code: string
      phone: string
      metadata: any
      risk_action: string
      international_format_phone: string | null
    }
    plan: any
    split: any
    order_id: any
    paidAt: string
    createdAt: string
    requested_amount: number
    pos_transaction_data: any
    source: any
    fees_breakdown: any
  }
}

export class PaystackService {
  private secretKey: string
  private baseUrl = "https://api.paystack.co"

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || ""
    if (!this.secretKey) {
      console.warn("Paystack secret key not found. Payment functionality will be limited.")
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async initializeTransaction(data: {
    email: string
    amount: number // Amount in kobo
    reference?: string
    callback_url?: string
    metadata?: any
  }): Promise<PaystackInitializeResponse> {
    if (!this.secretKey) {
      // Mock response for development
      const mockReference = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      return {
        status: true,
        message: "Authorization URL created (Mock)",
        data: {
          authorization_url: `https://checkout.paystack.com/${mockReference}`,
          access_code: mockReference,
          reference: mockReference,
        },
      }
    }

    return this.makeRequest("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    if (!this.secretKey) {
      // Mock successful verification for development
      return {
        status: true,
        message: "Verification successful (Mock)",
        data: {
          id: 123456789,
          domain: "test",
          status: "success",
          reference,
          amount: 100000, // Mock amount
          message: null,
          gateway_response: "Successful",
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          channel: "card",
          currency: "NGN",
          ip_address: "127.0.0.1",
          metadata: {},
          log: {},
          fees: 1500,
          fees_split: null,
          authorization: {
            authorization_code: "AUTH_mock123",
            bin: "408408",
            last4: "4081",
            exp_month: "12",
            exp_year: "2030",
            channel: "card",
            card_type: "visa",
            bank: "TEST BANK",
            country_code: "NG",
            brand: "visa",
            reusable: true,
            signature: "SIG_mock123",
            account_name: null,
          },
          customer: {
            id: 123456,
            first_name: "Test",
            last_name: "Customer",
            email: "test@example.com",
            customer_code: "CUS_mock123",
            phone: "+2348000000000",
            metadata: {},
            risk_action: "default",
            international_format_phone: null,
          },
          plan: null,
          split: null,
          order_id: null,
          paidAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          requested_amount: 100000,
          pos_transaction_data: null,
          source: null,
          fees_breakdown: null,
        },
      }
    }

    return this.makeRequest(`/transaction/verify/${reference}`)
  }

  async listTransactions(params?: {
    perPage?: number
    page?: number
    customer?: string
    status?: string
    from?: string
    to?: string
    amount?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/transaction${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    return this.makeRequest(endpoint)
  }
}

export const paystackService = new PaystackService()
