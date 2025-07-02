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
    this.secretKey = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY || ""
    if (!this.secretKey) {
      throw new Error("Paystack secret key not found. Payment functionality is disabled.")
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    }
  
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })
  
      const responseText = await response.text()
      let json
      try {
        json = JSON.parse(responseText)
      } catch (err) {
        console.error("Paystack returned non-JSON response:", responseText)
        throw new Error("Invalid JSON response from Paystack")
      }
  
      if (!response.ok) {
        console.error(`Paystack error [${response.status}]:`, json)
        throw new Error(json.message || `HTTP error! status: ${response.status}`)
      }
  
      return json
    } catch (err: any) {
      console.error("Paystack request failed:", err.message)
      throw err
    }
  }
  

  async initializeTransaction(data: {
    email: string
    amount: number // Amount in kobo
    reference?: string
    callback_url?: string
    metadata?: any
  }): Promise<PaystackInitializeResponse> {
    return this.makeRequest("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
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
