// lib/api.ts
export interface CryptoPrice {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  usd_market_cap: number;
}

export interface CryptoPricesResponse {
  [key: string]: CryptoPrice;
}

export interface TechnicalIndicator {
  rsi?: {
    value: number;
    signal: string;
    message: string;
  };
  macd?: {
    macd: number;
    signal: number;
    histogram: number;
    trend: string;
    message: string;
  };
}

export interface AnalysisData {
  coin: string;
  price: CryptoPrice;
  indicators: TechnicalIndicator;
}

export interface Alert {
  type: string;
  coin: string;
  message: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  timestamp: Date;
}

export interface AnalysisResults {
  timestamp: Date;
  data: AnalysisData[];
  aiAnalysis: string;
  alerts: Alert[];
}

export interface HistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface ServiceStatus {
  status: string;
  timestamp: Date;
  services: {
    coinGecko: boolean;
    taapi: boolean;
    openai: boolean;
  };
}

export interface PythonIndicatorRequest {
  prices: number[];
  indicator: string;
}

class CryptoAPIService {
  private baseURL: string;
  private wsURL: string;

  constructor(
    baseURL: string = "http://localhost:3000",
    wsURL: string = "ws://localhost:8080"
  ) {
    this.baseURL = baseURL;
    this.wsURL = wsURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  // Get service status
  async getStatus(): Promise<ServiceStatus> {
    return this.request<ServiceStatus>("/api/status");
  }

  // Get crypto prices
  async getCryptoPrices(): Promise<CryptoPricesResponse> {
    return this.request<CryptoPricesResponse>("/api/crypto/prices");
  }

  // Get analysis results
  async getAnalysis(): Promise<AnalysisResults> {
    return this.request<AnalysisResults>("/api/analysis");
  }

  // Get alerts
  async getAlerts(): Promise<Alert[]> {
    return this.request<Alert[]>("/api/alerts");
  }

  // Trigger manual analysis
  async triggerManualAnalysis(): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request<{ success: boolean; message: string }>(
      "/api/manual-analysis",
      {
        method: "POST",
      }
    );
  }

  // Get historical data
  async getHistoricalData(
    coinId: string,
    days: number = 30
  ): Promise<HistoricalData> {
    return this.request<HistoricalData>(
      `/api/crypto/${coinId}/history?days=${days}`
    );
  }

  // Calculate Python indicators
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async calculatePythonIndicators(data: PythonIndicatorRequest): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<any>("/api/python/indicators", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // WebSocket connection
  createWebSocketConnection(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMessage: (data: any) => void,
    onError?: (error: Event) => void
  ): WebSocket {
    const ws = new WebSocket(this.wsURL);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("WebSocket message parse error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      onError?.(error);
    };

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return ws;
  }
}

// Export singleton instance
export const cryptoAPI = new CryptoAPIService();
export default CryptoAPIService;
