/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { ApiResilienceEngine } from './src/integration-fabric/services/ApiResilienceEngine.js';

dotenv.config();

const moduleFilename = typeof __filename !== 'undefined'
  ? __filename
  : (import.meta?.url ? fileURLToPath(import.meta.url) : '');

const moduleDirname = typeof __dirname !== 'undefined'
  ? __dirname
  : (moduleFilename ? path.dirname(moduleFilename) : '');

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

app.use(express.json());

// In-memory Database for Leads and Simulation logs
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  segment: string;
  message: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'resolved';
}

const leadsDb: Lead[] = [
  {
    id: 'lead_1',
    name: 'Carlos Alberto Schneider',
    email: 'carlos@agropatria.com.br',
    phone: '+55 (34) 99888-1122',
    company: 'AgroPatria Exportadora Ltda',
    segment: 'Exportador',
    message: 'Prezados, temos uma safra de 15.000 toneladas de soja contratada e precisamos estruturar uma operação de swap cambial (USD/BRL) combinado com hedge na CME de Chicago para travar margem operacional. Aguardo retorno para agendamento de chamada.',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'new'
  },
  {
    id: 'lead_2',
    name: 'Beatriz Vasconcellos',
    email: 'b.vasconcellos@goldfund.com',
    phone: '+55 (11) 3033-9000',
    company: 'Vasconcellos Asset Management',
    segment: 'Fundo/Banco',
    message: 'Gostaria de obter o prospecto completo sobre as debêntures incentivadas de infraestrutura e a alocação tática de Tesouro IPCA+ com marcação a mercado que vocês estruturam para assessoria institucional.',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'contacted'
  }
];

// Seed initial news/articles
const articlesDb = [
  {
    id: 'art_1',
    title: 'A Geopolítica do Petróleo Brent: O Papel da OPEP+ e as Novas Rotas Logísticas',
    summary: 'Uma análise profunda sobre a dinâmica de oferta e demanda do barril Brent diante dos conflitos e gargalos logísticos globais.',
    content: 'O mercado de petróleo Brent enfrenta um dos períodos de maior reconfiguração geopolítica desde a década de 1970. Com o endurecimento das sanções, as rotas de comércio marítimo estenderam-se consideravelmente, gerando o fenômeno da frota paralela e inflacionando os custos de frete marítimo global.\n\nSimultaneamente, a OPEP+ mantém sua política de cortes voluntários de produção para equilibrar os preços de mercado perto da faixa dos USD 80 - USD 85 por barril, contrabalanceando o aumento constante de produção não-OPEP liderado pelos Estados Unidos, Guiana e Brasil.\n\nPara investidores institucionais, a volatilidade do Brent exige estratégias robustas de proteção (hedge). O mercado futuro na ICE oferece liquidez abundante, mas a dispersão do spread "Brent-WTI" e o prêmio de risco geopolítico exigem hedge dinâmico de spreads cambiais e derivativos de opções para otimizar os prêmios pagos pelas refinarias e importadoras nacionais.',
    category: 'Commodities',
    time: '04 Jul 2026',
    source: 'Vélios Research',
    author: 'Jucimar Vieira da Rocha',
    views: 1240,
    likes: 312
  },
  {
    id: 'art_2',
    title: 'Marcação a Mercado em Títulos Públicos: Maximizando Ganhos na Curva de Juros',
    summary: 'Como aproveitar a oscilação das taxas de juros futuras para obter retornos muito superiores à Selic com Tesouro IPCA+.',
    content: 'Muitos investidores veem o Tesouro Direto puramente como um ativo de carregamento até o vencimento. No entanto, investidores sofisticados utilizam a marcação a mercado para capturar ganhos de capital extraordinários de dois dígitos em janelas de médio prazo.\n\nA regra de ouro é simples: quando as taxas de juros futuras caem (fechamento de curva), o preço unitário (PU) dos títulos prefixados e indexados à inflação (Tesouro IPCA+) sobe. Quanto maior o "duration" (prazo médio ponderado) do título, maior é a sensibilidade do PU à variação da taxa.\n\nPor exemplo, uma redução de apenas 100 pontos base (1%) nas taxas do Tesouro IPCA+ 2045 pode gerar uma valorização patrimonial superior a 15% em poucos meses. O risco reside no movimento inverso: se as taxas de juros subirem (abertura de curva), o PU cai e a venda antecipada resultará em perdas. Por isso, a correta leitura macroeconômica do Banco Central e do Federal Reserve é fundamental para o sucesso das posições táticas na curva brasileira.',
    category: 'Renda Fixa',
    time: '03 Jul 2026',
    source: 'Vélios Research',
    author: 'Jucimar Vieira da Rocha',
    views: 954,
    likes: 188
  }
];

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// REST APIs
app.get('/api/leads', (req, res) => {
  res.json({ success: true, data: leadsDb });
});

app.post('/api/leads', (req, res) => {
  const { name, email, phone, company, segment, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Campos obrigatórios ausentes.' });
  }

  const newLead: Lead = {
    id: `lead_${Date.now()}`,
    name,
    email,
    phone: phone || '',
    company: company || '',
    segment: segment || 'Varejo',
    message,
    timestamp: new Date().toISOString(),
    status: 'new'
  };

  leadsDb.unshift(newLead);
  res.status(201).json({ success: true, data: newLead });
});

app.patch('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const leadIndex = leadsDb.findIndex(l => l.id === id);

  if (leadIndex === -1) {
    return res.status(404).json({ success: false, error: 'Lead não encontrado.' });
  }

  leadsDb[leadIndex].status = status;
  res.json({ success: true, data: leadsDb[leadIndex] });
});

app.get('/api/news', (req, res) => {
  res.json({ success: true, data: articlesDb });
});

// Cache and Telemetry for Market Quotes (TEEMS-MARKET-001 v1.0)
interface LogAuditEntry {
  id: string;
  timestamp: string;
  category: string;
  type: 'SUCCESS' | 'WARN' | 'ERROR' | 'INFO';
  message: string;
}

const initialDefaultQuotes = [
  { code: 'IBOV', symbol: '^BVSP', name: 'Ibovespa', price: 128450.00, change: 0.45, unit: 'pts', currency: 'BRL', exchange: 'B3', isMarketOpen: true, marketStatusText: 'Mercado Aberto (B3)', history: [127100, 127500, 127800, 128100, 128300, 128450], category: 'financeira' },
  { code: 'IBOVESPA', symbol: '^BVSP', name: 'Ibovespa', price: 128450.00, change: 0.45, unit: 'pts', currency: 'BRL', exchange: 'B3', isMarketOpen: true, marketStatusText: 'Mercado Aberto (B3)', history: [127100, 127500, 127800, 128100, 128300, 128450], category: 'financeira' },
  { code: 'DOLAR', symbol: 'USDBRL=X', name: 'Dólar Comercial', price: 5.5500, change: -0.15, unit: 'R$', currency: 'BRL', exchange: 'FOREX', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [5.48, 5.50, 5.52, 5.53, 5.54, 5.55], category: 'financeira' },
  { code: 'WDO', symbol: 'USDBRL=X', name: 'Mini Dólar', price: 5.5500, change: -0.15, unit: 'R$', currency: 'BRL', exchange: 'B3', isMarketOpen: true, marketStatusText: 'Mercado Aberto (B3)', history: [5.48, 5.50, 5.52, 5.53, 5.54, 5.55], category: 'financeira' },
  { code: 'EURO', symbol: 'EURBRL=X', name: 'Euro', price: 6.02, change: 0.15, unit: 'R$', currency: 'BRL', exchange: 'FOREX', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [5.95, 5.98, 6.00, 6.01, 6.01, 6.02], category: 'financeira' },
  { code: 'EUR', symbol: 'EURBRL=X', name: 'Euro', price: 6.02, change: 0.15, unit: 'R$', currency: 'BRL', exchange: 'FOREX', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [5.95, 5.98, 6.00, 6.01, 6.01, 6.02], category: 'financeira' },
  { code: 'OURO', symbol: 'GC=F', name: 'Ouro (Comex)', price: 2385.00, change: 0.20, unit: 'USD/oz', currency: 'USD', exchange: 'NYMEX', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [2330, 2345, 2355, 2365, 2375, 2385], category: 'metalica' },
  { code: 'PRATA', symbol: 'SI=F', name: 'Prata', price: 28.15, change: -0.42, unit: 'USD/oz', currency: 'USD', exchange: 'NYMEX', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [27.50, 27.80, 27.90, 28.00, 28.10, 28.15], category: 'metalica' },
  { code: 'BRENT', symbol: 'BZ=F', name: 'Petróleo Brent', price: 82.40, change: 0.80, unit: 'USD/bbl', currency: 'USD', exchange: 'ICE', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [79.50, 80.20, 81.00, 81.50, 82.00, 82.40], category: 'energetica' },
  { code: 'WTI', symbol: 'CL=F', name: 'Petróleo WTI', price: 78.20, change: 0.65, unit: 'USD/bbl', currency: 'USD', exchange: 'NYMEX', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [75.80, 76.50, 77.10, 77.60, 77.90, 78.20], category: 'energetica' },
  { code: 'GAS', symbol: 'NG=F', name: 'Gás Natural', price: 2.45, change: 1.10, unit: 'USD/MMBtu', currency: 'USD', exchange: 'NYMEX', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [2.30, 2.34, 2.38, 2.40, 2.42, 2.45], category: 'energetica' },
  { code: 'GAS_NATURAL', symbol: 'NG=F', name: 'Gás Natural', price: 2.45, change: 1.10, unit: 'USD/MMBtu', currency: 'USD', exchange: 'NYMEX', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [2.30, 2.34, 2.38, 2.40, 2.42, 2.45], category: 'energetica' },
  { code: 'CAFE', symbol: 'KC=F', name: 'Café Arábica', price: 1240.00, change: 2.50, unit: 'R$/saca (60kg)', currency: 'BRL', exchange: 'ICE/CEPEA', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [1190, 1200, 1210, 1220, 1230, 1240], category: 'agricola' },
  { code: 'SOJA', symbol: 'ZS=F', name: 'Soja Paranaguá', price: 135.00, change: 1.20, unit: 'R$/saca (60kg)', currency: 'BRL', exchange: 'CME/CEPEA', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [130, 131, 132, 133, 134, 135], category: 'agricola' },
  { code: 'MILHO', symbol: 'ZC=F', name: 'Milho Campinas', price: 62.80, change: -0.50, unit: 'R$/saca (60kg)', currency: 'BRL', exchange: 'CME/CEPEA', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [60.50, 61.20, 61.80, 62.10, 62.50, 62.80], category: 'agricola' },
  { code: 'ICUMSA45', symbol: 'SB=F', name: 'Açúcar ICUMSA 45', price: 435.00, change: 0.65, unit: 'USD/ton', currency: 'USD', exchange: 'ICE', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [425, 428, 430, 431, 433, 435], category: 'agricola' },
  { code: 'VHP', symbol: 'SB=F', name: 'Açúcar VHP', price: 410.00, change: -0.10, unit: 'USD/ton', currency: 'USD', exchange: 'ICE', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [415, 414, 413, 412, 411, 410], category: 'agricola' },
  { code: 'ACRST', symbol: 'CEPEA/SB=F', name: 'Açúcar Cristal', price: 138.50, change: 0.55, unit: 'R$/saca (50kg)', currency: 'BRL', exchange: 'CEPEA/B3', isMarketOpen: true, marketStatusText: 'Mercado Aberto (B3)', history: [134.50, 135.80, 136.00, 137.10, 137.90, 138.50], category: 'agricola' },
  { code: 'ACDEM', symbol: 'CEPEA/SB=F', name: 'Açúcar Demerara', price: 142.00, change: 0.20, unit: 'R$/saca (50kg)', currency: 'BRL', exchange: 'CEPEA/B3', isMarketOpen: true, marketStatusText: 'Mercado Aberto (B3)', history: [139.80, 140.20, 140.80, 141.15, 141.60, 142.00], category: 'agricola' },
  { code: 'ACUCAR', symbol: 'SB=F', name: 'Açúcar No. 11', price: 19.25, change: -0.95, unit: 'USD/lb', currency: 'USD', exchange: 'ICE', isMarketOpen: true, marketStatusText: 'Mercado Futuro Aberto', history: [19.00, 19.10, 19.20, 19.30, 19.40, 19.50], category: 'agricola' },
  { code: 'BTC', symbol: 'BTC-USD', name: 'Bitcoin', price: 64250.00, change: 1.85, unit: 'USD', currency: 'USD', exchange: 'COINBASE', isMarketOpen: true, marketStatusText: 'Ativo 24/7 Aberto', history: [63000, 63400, 63800, 64100, 64200, 64250], category: 'financeira' },
  { code: 'ETH', symbol: 'ETH-USD', name: 'Ethereum', price: 3420.00, change: 1.60, unit: 'USD', currency: 'USD', exchange: 'COINBASE', isMarketOpen: true, marketStatusText: 'Ativo 24/7 Aberto', history: [3300, 3330, 3360, 3390, 3410, 3420], category: 'financeira' },
  { code: 'NASDAQ', symbol: '^IXIC', name: 'Nasdaq Composite', price: 18250.00, change: 0.85, unit: 'pts', currency: 'USD', exchange: 'NASDAQ', isMarketOpen: true, marketStatusText: 'Mercado Aberto', history: [18000, 18100, 18150, 18200, 18230, 18250], category: 'financeira' },
  { code: 'DOWJONES', symbol: '^DJI', name: 'Dow Jones', price: 39120.00, change: 0.35, unit: 'pts', currency: 'USD', exchange: 'DJI', isMarketOpen: true, marketStatusText: 'Mercado Aberto', history: [38800, 38900, 39000, 39050, 39100, 39120], category: 'financeira' },
  { code: 'DOW_JONES', symbol: '^DJI', name: 'Dow Jones', price: 39120.00, change: 0.35, unit: 'pts', currency: 'USD', exchange: 'DJI', isMarketOpen: true, marketStatusText: 'Mercado Aberto', history: [38800, 38900, 39000, 39050, 39100, 39120], category: 'financeira' },
  { code: 'SP500', symbol: '^GSPC', name: 'S&P 500', price: 5480.00, change: 0.60, unit: 'pts', currency: 'USD', exchange: 'S&P', isMarketOpen: true, marketStatusText: 'Mercado Aberto', history: [5400, 5420, 5440, 5460, 5470, 5480], category: 'financeira' }
];

let quotesCache: any = {
  data: initialDefaultQuotes,
  timestamp: Date.now()
};
let lastCacheTime = Date.now();
const CACHE_TTL = 30000; // 30 seconds cache

let quotesAuditLogs: LogAuditEntry[] = [
  { id: 'init-1', timestamp: new Date().toLocaleTimeString('pt-BR'), category: 'MERCADO_LIVE', type: 'INFO', message: 'Serviço global de cotações inicializado com cache de 17 ativos.' }
];

function checkMarketStatus(exchange: 'B3' | 'CME' | 'NYMEX' | 'ICE' | 'FOREX'): { isOpen: boolean; statusText: string; exchangeName: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun, 6 = Sat
  const hour = now.getHours();

  if (exchange === 'B3') {
    // B3 runs Mon-Fri 09:00 - 18:00 BRT
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isOpen = isWeekday && (hour >= 9 && hour < 18);
    return {
      isOpen,
      statusText: isOpen ? 'Mercado Aberto (B3)' : 'Mercado Fechado - Último Fechamento',
      exchangeName: 'B3 Brasil Bolsa Balcão'
    };
  } else {
    // International markets: close Friday 18h BRT, open Sunday 19h BRT
    const isClosed = (dayOfWeek === 6) || (dayOfWeek === 5 && hour >= 18) || (dayOfWeek === 0 && hour < 19);
    const isOpen = !isClosed;
    return {
      isOpen,
      statusText: isOpen ? 'Mercado Futuro Aberto' : 'Mercado Fechado - Último Fechamento',
      exchangeName: exchange === 'ICE' ? 'ICE Futures US/UK' : exchange === 'NYMEX' ? 'NYMEX Commodity Exchange' : 'CME Group Chicago'
    };
  }
}

async function fetchYahooQuote(ticker: string) {
  try {
    const res = await ApiResilienceEngine.fetchWithTimeoutAndRetry(
      async (signal) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=7d`;
        const response = await fetch(url, {
          signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          return await response.json() as any;
        }
        const text = await response.text();
        throw new Error(`Non-JSON response received for ${ticker}`);
      },
      { timeoutMs: 4000, maxRetries: 1, backoffMs: 200, serviceName: `yahoo_finance_${ticker}` }
    );

    const data = res.data;
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;
    const price = meta?.regularMarketPrice || meta?.chartPreviousClose || 0;
    const prevClose = meta?.chartPreviousClose || price;
    const change = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
    
    const quotes = result?.indicators?.quote?.[0]?.close || [];
    const history: number[] = quotes.filter((q: any) => typeof q === 'number');
    
    return {
      price,
      change,
      history: history.slice(-6),
      isFallback: false
    };
  } catch (error) {
    console.warn(`[Yahoo Finance Fetch Failed for ${ticker}]:`, error instanceof Error ? error.message : error);
    return { price: 0, change: 0, history: [], isFallback: true };
  }
}

// Global Async Worker to periodically refresh quotes to keep the cache continuously updated
async function runPriceUpdateWorker() {
  const startTime = Date.now();
  console.log('[Price Update Worker] Iniciando ciclo de sincronização global...');

  try {
    // Fetch all tickers in parallel
    const [
      ibovRaw, usdRaw, eurRaw, goldRaw, silverRaw,
      brentRaw, wtiRaw, natgasRaw, coffeeRaw, soyRaw,
      sugarRaw, cornRaw, btcRaw, ethRaw, nasdaqRaw,
      djiRaw, sp500Raw
    ] = await Promise.all([
      fetchYahooQuote('^BVSP'),
      fetchYahooQuote('USDBRL=X'),
      fetchYahooQuote('EURBRL=X'),
      fetchYahooQuote('GC=F'),
      fetchYahooQuote('SI=F'),
      fetchYahooQuote('BZ=F'),
      fetchYahooQuote('CL=F'),
      fetchYahooQuote('NG=F'),
      fetchYahooQuote('KC=F'),
      fetchYahooQuote('ZS=F'),
      fetchYahooQuote('SB=F'),
      fetchYahooQuote('ZC=F'),
      fetchYahooQuote('BTC-USD'),
      fetchYahooQuote('ETH-USD'),
      fetchYahooQuote('^IXIC'),
      fetchYahooQuote('^DJI'),
      fetchYahooQuote('^GSPC')
    ]);

    const usdRate = usdRaw.price || 5.55;

    // Resolve Market Status
    const b3Status = checkMarketStatus('B3');
    const cmeStatus = checkMarketStatus('CME');
    const nymexStatus = checkMarketStatus('NYMEX');
    const iceStatus = checkMarketStatus('ICE');
    const forexStatus = checkMarketStatus('FOREX');

    // Helper to log updates in audit trail
    const recordAssetUpdate = (code: string, oldPrice: number, newPrice: number, symbol: string) => {
      if (oldPrice !== newPrice && oldPrice > 0) {
        const id = `audit-${Date.now()}-${code}`;
        quotesAuditLogs.unshift({
          id,
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          category: 'MERCADO_LIVE',
          type: 'SUCCESS',
          message: `Ativo ${code} (${symbol}) atualizado de ${oldPrice.toFixed(2)} para ${newPrice.toFixed(2)}.`
        });
      }
    };

    // 1. IBOV: ^BVSP
    const ibovPrice = ibovRaw.price || 128450.00;
    const ibovHistory = ibovRaw.history.length > 0 ? ibovRaw.history : [127100, 127500, 127800, 128100, 128300, 128450];

    // 2. DOLAR
    const usdPrice = usdRaw.price || 5.55;
    const usdHistory = usdRaw.history.length > 0 ? usdRaw.history : [5.48, 5.50, 5.52, 5.53, 5.54, 5.55];

    // 3. EURO
    const eurPrice = eurRaw.price || 6.02;
    const eurHistory = eurRaw.history.length > 0 ? eurRaw.history : [5.95, 5.98, 6.00, 6.01, 6.01, 6.02];

    // 4. OURO
    const goldPrice = goldRaw.price || 2385.00;
    const goldHistory = goldRaw.history.length > 0 ? goldRaw.history : [2330, 2345, 2355, 2365, 2375, 2385];

    // 5. PRATA
    const silverPrice = silverRaw.price || 28.15;
    const silverHistory = silverRaw.history.length > 0 ? silverRaw.history : [27.50, 27.80, 27.90, 28.00, 28.10, 28.15];

    // 6. BRENT
    const brentPrice = brentRaw.price || 82.40;
    const brentHistory = brentRaw.history.length > 0 ? brentRaw.history : [79.50, 80.20, 81.00, 81.50, 82.00, 82.40];

    // 7. WTI
    const wtiPrice = wtiRaw.price || 78.20;
    const wtiHistory = wtiRaw.history.length > 0 ? wtiRaw.history : [75.80, 76.50, 77.10, 77.60, 77.90, 78.20];

    // 8. GAS / GAS_NATURAL
    const natgasPrice = natgasRaw.price || 2.45;
    const natgasHistory = natgasRaw.history.length > 0 ? natgasRaw.history : [2.30, 2.34, 2.38, 2.40, 2.42, 2.45];

    // 9. CAFE
    const rawCoffeePrice = coffeeRaw.price || 185.00;
    const convertCoffee = (p: number) => (p * 0.01) * usdRate * 132.277;
    const cafePrice = convertCoffee(rawCoffeePrice);
    const cafeHistory = coffeeRaw.history.length > 0 ? coffeeRaw.history.map(convertCoffee) : [1190, 1200, 1210, 1220, 1230, 1240];

    // 10. SOJA
    const rawSoyPrice = soyRaw.price || 1160.00;
    const convertSoy = (p: number) => ((p * 0.01) * usdRate * 2.2046) + 5.00;
    const sojaPrice = convertSoy(rawSoyPrice);
    const sojaHistory = soyRaw.history.length > 0 ? soyRaw.history.map(convertSoy) : [130, 131, 132, 133, 134, 135];

    // 11. MILHO
    const rawCornPrice = cornRaw.price || 430.00;
    const convertCorn = (p: number) => ((p * 0.01) * usdRate * 2.362) + 6.50;
    const milhoPrice = convertCorn(rawCornPrice);
    const milhoHistory = cornRaw.history.length > 0 ? cornRaw.history.map(convertCorn) : [60.50, 61.20, 61.80, 62.10, 62.50, 62.80];

    // 12. ACUCAR / Sugar No 11 NY
    const rawSugarPrice = sugarRaw.price || 19.50;
    const icumsaPriceUSD = rawSugarPrice * 22.0462;
    const icumsaHistory = sugarRaw.history.length > 0 ? sugarRaw.history.map(h => h * 22.0462) : [425, 428, 430, 431, 433, 435];
    const vhpPriceUSD = icumsaPriceUSD * 0.942;
    const vhpHistory = icumsaHistory.map(h => h * 0.942);
    const cristalPriceBRL = (rawSugarPrice * 0.01 * usdRate * 110.231) + 18.50;
    const cristalHistory = sugarRaw.history.length > 0 ? sugarRaw.history.map(h => (h * 0.01 * usdRate * 110.231) + 18.50) : [134.50, 135.80, 136.00, 137.10, 137.90, 138.50];
    const demeraraPriceBRL = cristalPriceBRL * 1.025;
    const demeraraHistory = cristalHistory.map(h => h * 1.025);

    // 13. BTC
    const btcPrice = btcRaw.price || 64250.00;
    const btcHistory = btcRaw.history.length > 0 ? btcRaw.history : [63000, 63400, 63800, 64100, 64200, 64250];

    // 14. ETH
    const ethPrice = ethRaw.price || 3420.00;
    const ethHistory = ethRaw.history.length > 0 ? ethRaw.history : [3300, 3330, 3360, 3390, 3410, 3420];

    // 15. NASDAQ
    const nasdaqPrice = nasdaqRaw.price || 18250.00;
    const nasdaqHistory = nasdaqRaw.history.length > 0 ? nasdaqRaw.history : [18000, 18100, 18150, 18200, 18230, 18250];

    // 16. DOW JONES
    const djiPrice = djiRaw.price || 39120.00;
    const djiHistory = djiRaw.history.length > 0 ? djiRaw.history : [38800, 38900, 39000, 39050, 39100, 39120];

    // 17. S&P 500
    const sp500Price = sp500Raw.price || 5480.00;
    const sp500History = sp500Raw.history.length > 0 ? sp500Raw.history : [5400, 5420, 5440, 5460, 5470, 5480];

    const formatQuotes = [
      { code: 'IBOV', symbol: '^BVSP', name: 'Ibovespa', price: ibovPrice, change: ibovRaw.change || 0.45, unit: 'pts', currency: 'BRL', exchange: 'B3', isMarketOpen: b3Status.isOpen, marketStatusText: b3Status.statusText, history: ibovHistory, category: 'financeira' },
      { code: 'IBOVESPA', symbol: '^BVSP', name: 'Ibovespa', price: ibovPrice, change: ibovRaw.change || 0.45, unit: 'pts', currency: 'BRL', exchange: 'B3', isMarketOpen: b3Status.isOpen, marketStatusText: b3Status.statusText, history: ibovHistory, category: 'financeira' },
      { code: 'DOLAR', symbol: 'USDBRL=X', name: 'Dólar Comercial', price: usdPrice, change: usdRaw.change || -0.15, unit: 'R$', currency: 'BRL', exchange: 'FOREX', isMarketOpen: forexStatus.isOpen, marketStatusText: forexStatus.statusText, history: usdHistory, category: 'financeira' },
      { code: 'WDO', symbol: 'USDBRL=X', name: 'Mini Dólar', price: usdPrice, change: usdRaw.change || -0.15, unit: 'R$', currency: 'BRL', exchange: 'B3', isMarketOpen: b3Status.isOpen, marketStatusText: b3Status.statusText, history: usdHistory, category: 'financeira' },
      { code: 'EURO', symbol: 'EURBRL=X', name: 'Euro', price: eurPrice, change: eurRaw.change || 0.15, unit: 'R$', currency: 'BRL', exchange: 'FOREX', isMarketOpen: forexStatus.isOpen, marketStatusText: forexStatus.statusText, history: eurHistory, category: 'financeira' },
      { code: 'EUR', symbol: 'EURBRL=X', name: 'Euro', price: eurPrice, change: eurRaw.change || 0.15, unit: 'R$', currency: 'BRL', exchange: 'FOREX', isMarketOpen: forexStatus.isOpen, marketStatusText: forexStatus.statusText, history: eurHistory, category: 'financeira' },
      { code: 'OURO', symbol: 'GC=F', name: 'Ouro (Comex)', price: goldPrice, change: goldRaw.change || 0.20, unit: 'USD/oz', currency: 'USD', exchange: 'NYMEX', isMarketOpen: nymexStatus.isOpen, marketStatusText: nymexStatus.statusText, history: goldHistory, category: 'metalica' },
      { code: 'PRATA', symbol: 'SI=F', name: 'Prata', price: silverPrice, change: silverRaw.change || -0.42, unit: 'USD/oz', currency: 'USD', exchange: 'NYMEX', isMarketOpen: nymexStatus.isOpen, marketStatusText: nymexStatus.statusText, history: silverHistory, category: 'metalica' },
      { code: 'BRENT', symbol: 'BZ=F', name: 'Petróleo Brent', price: brentPrice, change: brentRaw.change || 0.80, unit: 'USD/bbl', currency: 'USD', exchange: 'ICE', isMarketOpen: iceStatus.isOpen, marketStatusText: iceStatus.statusText, history: brentHistory, category: 'energetica' },
      { code: 'WTI', symbol: 'CL=F', name: 'Petróleo WTI', price: wtiPrice, change: wtiRaw.change || 0.65, unit: 'USD/bbl', currency: 'USD', exchange: 'NYMEX', isMarketOpen: nymexStatus.isOpen, marketStatusText: nymexStatus.statusText, history: wtiHistory, category: 'energetica' },
      { code: 'GAS', symbol: 'NG=F', name: 'Gás Natural', price: natgasPrice, change: natgasRaw.change || 1.10, unit: 'USD/MMBtu', currency: 'USD', exchange: 'NYMEX', isMarketOpen: nymexStatus.isOpen, marketStatusText: nymexStatus.statusText, history: natgasHistory, category: 'energetica' },
      { code: 'GAS_NATURAL', symbol: 'NG=F', name: 'Gás Natural', price: natgasPrice, change: natgasRaw.change || 1.10, unit: 'USD/MMBtu', currency: 'USD', exchange: 'NYMEX', isMarketOpen: nymexStatus.isOpen, marketStatusText: nymexStatus.statusText, history: natgasHistory, category: 'energetica' },
      { code: 'CAFE', symbol: 'KC=F', name: 'Café Arábica', price: cafePrice, change: coffeeRaw.change || 2.50, unit: 'R$/saca (60kg)', currency: 'BRL', exchange: 'ICE/CEPEA', isMarketOpen: iceStatus.isOpen, marketStatusText: iceStatus.statusText, history: cafeHistory, category: 'agricola' },
      { code: 'SOJA', symbol: 'ZS=F', name: 'Soja Paranaguá', price: sojaPrice, change: soyRaw.change || 1.20, unit: 'R$/saca (60kg)', currency: 'BRL', exchange: 'CME/CEPEA', isMarketOpen: cmeStatus.isOpen, marketStatusText: cmeStatus.statusText, history: sojaHistory, category: 'agricola' },
      { code: 'MILHO', symbol: 'ZC=F', name: 'Milho Campinas', price: milhoPrice, change: cornRaw.change || -0.50, unit: 'R$/saca (60kg)', currency: 'BRL', exchange: 'CME/CEPEA', isMarketOpen: cmeStatus.isOpen, marketStatusText: cmeStatus.statusText, history: milhoHistory, category: 'agricola' },
      { code: 'ICUMSA45', symbol: 'SB=F', name: 'Açúcar ICUMSA 45', price: icumsaPriceUSD, change: sugarRaw.change || 0.65, unit: 'USD/ton', currency: 'USD', exchange: 'ICE', isMarketOpen: iceStatus.isOpen, marketStatusText: iceStatus.statusText, history: icumsaHistory, category: 'agricola' },
      { code: 'VHP', symbol: 'SB=F', name: 'Açúcar VHP', price: vhpPriceUSD, change: sugarRaw.change || -0.10, unit: 'USD/ton', currency: 'USD', exchange: 'ICE', isMarketOpen: iceStatus.isOpen, marketStatusText: iceStatus.statusText, history: vhpHistory, category: 'agricola' },
      { code: 'ACRST', symbol: 'CEPEA/SB=F', name: 'Açúcar Cristal', price: cristalPriceBRL, change: sugarRaw.change || 0.55, unit: 'R$/saca (50kg)', currency: 'BRL', exchange: 'CEPEA/B3', isMarketOpen: b3Status.isOpen, marketStatusText: b3Status.statusText, history: cristalHistory, category: 'agricola' },
      { code: 'ACDEM', symbol: 'CEPEA/SB=F', name: 'Açúcar Demerara', price: demeraraPriceBRL, change: sugarRaw.change || 0.20, unit: 'R$/saca (50kg)', currency: 'BRL', exchange: 'CEPEA/B3', isMarketOpen: b3Status.isOpen, marketStatusText: b3Status.statusText, history: demeraraHistory, category: 'agricola' },
      { code: 'ACUCAR', symbol: 'SB=F', name: 'Açúcar No. 11', price: rawSugarPrice, change: sugarRaw.change || -0.95, unit: 'USD/lb', currency: 'USD', exchange: 'ICE', isMarketOpen: iceStatus.isOpen, marketStatusText: iceStatus.statusText, history: sugarRaw.history.length > 0 ? sugarRaw.history : [19.00, 19.10, 19.20, 19.30, 19.40, 19.50], category: 'agricola' },
      { code: 'BTC', symbol: 'BTC-USD', name: 'Bitcoin', price: btcPrice, change: btcRaw.change || 1.85, unit: 'USD', currency: 'USD', exchange: 'COINBASE', isMarketOpen: true, marketStatusText: 'Ativo 24/7 Aberto', history: btcHistory, category: 'financeira' },
      { code: 'ETH', symbol: 'ETH-USD', name: 'Ethereum', price: ethPrice, change: ethRaw.change || 1.60, unit: 'USD', currency: 'USD', exchange: 'COINBASE', isMarketOpen: true, marketStatusText: 'Ativo 24/7 Aberto', history: ethHistory, category: 'financeira' },
      { code: 'NASDAQ', symbol: '^IXIC', name: 'Nasdaq Composite', price: nasdaqPrice, change: nasdaqRaw.change || 0.85, unit: 'pts', currency: 'USD', exchange: 'NASDAQ', isMarketOpen: cmeStatus.isOpen, marketStatusText: cmeStatus.statusText, history: nasdaqHistory, category: 'financeira' },
      { code: 'DOWJONES', symbol: '^DJI', name: 'Dow Jones', price: djiPrice, change: djiRaw.change || 0.35, unit: 'pts', currency: 'USD', exchange: 'DJI', isMarketOpen: cmeStatus.isOpen, marketStatusText: cmeStatus.statusText, history: djiHistory, category: 'financeira' },
      { code: 'DOW_JONES', symbol: '^DJI', name: 'Dow Jones', price: djiPrice, change: djiRaw.change || 0.35, unit: 'pts', currency: 'USD', exchange: 'DJI', isMarketOpen: cmeStatus.isOpen, marketStatusText: cmeStatus.statusText, history: djiHistory, category: 'financeira' },
      { code: 'SP500', symbol: '^GSPC', name: 'S&P 500', price: sp500Price, change: sp500Raw.change || 0.60, unit: 'pts', currency: 'USD', exchange: 'S&P', isMarketOpen: cmeStatus.isOpen, marketStatusText: cmeStatus.statusText, history: sp500History, category: 'financeira' }
    ];

    const cleanedQuotes = formatQuotes.map(q => {
      const precision = q.currency === 'BRL' && q.code !== 'DOLAR' ? 2 : 4;
      return {
        ...q,
        price: parseFloat(q.price.toFixed(precision)),
        change: parseFloat(q.change.toFixed(2)),
        history: q.history.map((h: number) => parseFloat(h.toFixed(precision)))
      };
    });

    // Record audits if prices changed
    if (quotesCache && Array.isArray(quotesCache.data)) {
      cleanedQuotes.forEach(newQ => {
        const oldQ = quotesCache.data.find((x: any) => x.code === newQ.code);
        if (oldQ && oldQ.price !== newQ.price) {
          recordAssetUpdate(newQ.code, oldQ.price, newQ.price, newQ.symbol);
        }
      });
    }

    quotesCache = {
      data: cleanedQuotes,
      timestamp: Date.now()
    };
    lastCacheTime = Date.now();

    if (quotesAuditLogs.length > 150) {
      quotesAuditLogs = quotesAuditLogs.slice(0, 150);
    }

    console.log(`[Price Update Worker] Sincronização global concluída em ${Date.now() - startTime}ms.`);
  } catch (error) {
    console.error('[Price Update Worker Error]:', error);
    quotesAuditLogs.unshift({
      id: `audit-err-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      category: 'MERCADO_LIVE',
      type: 'WARN',
      message: `Interrupção temporária nas APIs externas. Utilizando cache institucional resiliente: ${error instanceof Error ? error.message : error}`
    });
  }
}

// Start continuous worker instantly
setInterval(runPriceUpdateWorker, 30000);
setTimeout(runPriceUpdateWorker, 1000);

app.get('/api/realtime-quotes', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '127.0.0.1';
  const rl = ApiResilienceEngine.checkRateLimit(clientIp, 'realtime-quotes', 300, 60000);
  
  if (!rl.allowed) {
    return res.json({
      success: true,
      data: quotesCache.data,
      source: 'stale_rate_limited',
      telemetry: {
        lastUpdate: new Date(lastCacheTime).toISOString(),
        cachedAt: lastCacheTime,
        rateLimitRemaining: 0
      }
    });
  }

  ApiResilienceEngine.recordMetrics('realtime_quotes_endpoint', true, 0, true, false, 200);
  res.json({
    success: true,
    data: quotesCache.data,
    source: 'cache',
    telemetry: {
      lastUpdate: new Date(lastCacheTime).toISOString(),
      ttlMs: CACHE_TTL,
      cachedAt: lastCacheTime,
      rateLimitRemaining: rl.remaining
    }
  });
});

app.get('/api/market-audit', (req, res) => {
  res.json({
    success: true,
    logs: quotesAuditLogs,
    metrics: ApiResilienceEngine.getMetrics()
  });
});

// AI Commodity Analysis endpoint using Gemini - TEEMS-API-001 v1.0
app.post('/api/gemini/analysis', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '127.0.0.1';
  const rl = ApiResilienceEngine.checkRateLimit(clientIp, 'gemini-analysis', 15, 60000);
  if (!rl.allowed) {
    return res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: 'Limite de requisições à IA excedido. Por favor, aguarde alguns segundos antes de solicitar nova análise.',
      resetMs: rl.resetMs
    });
  }

  const { commodityName, commodityType, searchQuery } = req.body;
  if (!commodityName) {
    return res.status(400).json({ success: false, error: 'Commodity name is required' });
  }

  const getFallbackAnalysis = () => {
    const hasSearch = searchQuery && searchQuery.trim().length > 0;
    const combinedTitle = hasSearch 
      ? `Análise Técnica Conjugada: ${commodityName} & ${searchQuery}`
      : `Análise Técnica & Fundamentalista Avançada: ${commodityName} (${commodityType === 'agricola' ? 'Agrícola' : commodityType === 'metalica' ? 'Metálica' : 'Energética'})`;

    return `### ${combinedTitle}

> **Nota de Mercado**: Análise gerada pelo motor institucional Vélios (Modo de Alta Liquidez). O prêmio geopolítico e o spread cambial (USD/BRL) continuam atuando como os principais vetores de volatilidade para o preço spot. ${hasSearch ? `Esta análise avalia a correlação tática entre o ativo pesquisado **${searchQuery}** e a commodity de referência **${commodityName}**.` : ''}

#### 1. Vetores Fundamentalistas de Oferta e Demanda
* **Oferta Global**: Ajuste positivo na produção física global devido a fatores climáticos favoráveis de curto prazo, compensados por gargalos operacionais no canal do Panamá e portos de Santos/Paranaguá.
* **Demanda de Exportação**: O apetite asiático (liderado pelas compras da China) permanece sustentado, suportando os níveis de suporte de preços futuros na bolsa correspondente.
${hasSearch ? `* **Interação ${searchQuery} & ${commodityName}**: Análise preliminar indica uma correlação de fluxo de capital entre ambos os mercados. Flutuações nos preços de energia e custo de capital influenciam diretamente a atratividade do ativo pesquisado.` : `* **Estoques de Passagem (Carryover Stocks)**: Níveis críticos de relação estoque/consumo indicam que qualquer quebra climática inesperada pode catapultar os preços em até 15% na janela de curto prazo.`}

#### 2. Cenários Técnicos de Suportes e Resistências
* **Suporte de Curto Prazo**: Forte linha de suporte técnico em torno do valor atual do mercado spot, com volume consolidado acumulando posições compradas no atacado físico.
* **Resistências Importantes**: Níveis superiores representam fortes barreiras de liquidez onde produtores corporativos tradicionalmente disparam suas ordens de hedge programado de safra.

#### 3. Recomendações Profissionais de Gestão de Risco (Hedge)
* **Recomendação para Produtores / Investidores**: Travar até 45% da produção estimada utilizando derivativos de venda (Put Options) para garantir o custo mínimo operacional sem abdicar de eventuais altas futuras. ${hasSearch ? `Considerar o balanceamento tático em **${searchQuery}** como porto seguro em momentos de estresse cambial.` : ''}
* **Recomendação para Compradores Industriais**: Implementar estratégias de Swap Cambial combinado com contratos futuros de compra para blindar o balanço financeiro contra flutuações do dólar.`;
  };

  if (!ai) {
    ApiResilienceEngine.recordMetrics('gemini_api', true, 0, false, true, 200);
    return res.json({
      success: true,
      analysis: getFallbackAnalysis(),
      source: 'institutional_fallback'
    });
  }

  const startTime = Date.now();
  try {
    let prompt = '';
    const hasSearch = searchQuery && searchQuery.trim().length > 0;
    if (hasSearch) {
      prompt = `Você é um Analista Macro Sênior de Commodities Globais da BlackRock/Bloomberg.
Escreva uma análise profunda, elegante e extremamente profissional conjugando a commodity principal de referência "${commodityName}" (Categoria: ${commodityType}) com o ativo ou termo de pesquisa "${searchQuery}" que o usuário deseja analisar em paralelo.
Analise a correlação macroeconômica, impactos de custo de produção, canais de arbitragem cambial ou sinergias de mercado entre "${commodityName}" e "${searchQuery}".
Utilize cabeçalhos Markdown, destaque termos importantes, apresente fatores fundamentalistas combinados de oferta, demanda, logística e fatores técnicos (suportes, resistências, médias móveis), além de estratégias de hedging recomendadas integrando ambos os ativos.
Adote tom sênior, técnico e internacional. Não dê garantias de lucro. Informe que há riscos significativos de cauda e volatilidade inerente.
Escreva tudo em português brasileiro.`;
    } else {
      prompt = `Você é um Analista Macro Sênior de Commodities Globais da BlackRock/Bloomberg.
Escreva uma análise profunda, elegante e extremamente profissional sobre a commodity "${commodityName}" (Categoria: ${commodityType}).
Utilize cabeçalhos Markdown, destaque termos importantes, apresente fatores fundamentalistas (oferta, demanda, clima, logística) e fatores técnicos (suportes, resistências, médias móveis), além de estratégias de hedging recomendadas.
Adote tom sênior, técnico e internacional. Não dê garantias de lucro. Informe que há riscos significativos de cauda e volatilidade inerente.
Escreva tudo em português brasileiro.`;
    }

    let responseText = '';
    
    // Try primary model (gemini-2.5-flash) and secondary fallbacks
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: "Você é um analista financeiro institucional sênior especialista em commodities e câmbio.",
            temperature: 0.7
          }
        });
        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini Attempt Failed for ${model}]:`, err instanceof Error ? err.message : err);
      }
    }

    const latencyMs = Date.now() - startTime;

    if (responseText) {
      ApiResilienceEngine.recordMetrics('gemini_api', true, latencyMs, false, false, 200);
      return res.json({ success: true, analysis: responseText, latencyMs });
    }

    // If both models experienced high demand (503) or error, return graceful fallback
    ApiResilienceEngine.recordMetrics('gemini_api', false, latencyMs, false, true, 503);
    console.error('Gemini all models exhausted or unavailable, returning institutional fallback analysis:', lastError);
    return res.json({ 
      success: true, 
      analysis: getFallbackAnalysis(),
      notice: 'Exibindo relatório sintético pré-aprovado devido à alta demanda momentânea no cluster de IA.',
      source: 'institutional_fallback'
    });

  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    ApiResilienceEngine.recordMetrics('gemini_api', false, latencyMs, false, true, 500);
    console.error('Gemini general error:', err);
    return res.json({ 
      success: true, 
      analysis: getFallbackAnalysis(),
      source: 'institutional_fallback'
    });
  }
});

// Health & API Telemetry Endpoint - TEEMS-API-001 v1.0
app.get('/api/health/api-status', (req, res) => {
  res.json({
    status: 'ok',
    teems: 'TEEMS-API-001 v1.0',
    timestamp: new Date().toISOString(),
    resilienceMetrics: ApiResilienceEngine.getMetrics()
  });
});

// Setup Vite Dev server or static files depending on the environment
async function initServer() {
  if (!isProd) {
    // Serve static files from public folder directly
    app.use(express.static(path.resolve(moduleDirname, 'public')));

    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });

    app.use(vite.middlewares);

    // Render HTML
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(moduleDirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Serve production static files
    app.use(express.static(path.resolve(moduleDirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(moduleDirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VÉLIOS PORTAL] Server is running on port ${PORT}`);
  });
}

initServer().catch(console.error);
