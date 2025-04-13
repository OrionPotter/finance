import { NextResponse } from 'next/server';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';

// 定义期货数据类型（无 time）
interface FuturesItem {
  name: string;
  price: number;
  change: string;
}

export async function GET() {
  try {
    const timestamp = Date.now();
    const symbols = [
      'hf_OIL',
      'hf_CL',
      'hf_NG',
      'hf_GC',
      'fx_seurcny',
      'fx_susdcny',
      'hf_SI',
      'hf_HG',
    ].join(',');

    const response = await axios.get(`https://hq.sinajs.cn/?_=${timestamp}&list=${symbols}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        Referer: 'https://finance.sina.com.cn/futures/quotes/OIL.shtml',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      responseType: 'arraybuffer',
    });

    const decoder = new TextDecoder('gb18030');
    const text = decoder.decode(response.data);
    const futures: FuturesItem[] = [];
    const lines = text.split('\n').filter(line => line.trim());

    for (const line of lines) {
      const match = line.match(/^var hq_str_(.+)="(.+)";$/);
      if (!match) continue;

      const [, symbol, data] = match;
      const fields = data.split(',');

      let name: string, price: number, close: number, time: string, date: string;

      if (symbol.startsWith('hf_')) {
        price = parseFloat(fields[0]) || 0;
        close = parseFloat(fields[2]) || price;
        time = fields[6];
        date = fields[12];
        name = fields[13] || symbol;
      } else if (symbol.startsWith('fx_')) {
        price = parseFloat(fields[1]) || 0;
        close = parseFloat(fields[3]) || price;
        time = fields[0];
        date = fields[18] || fields[12];
        name = fields[9] || symbol;
      } else {
        continue;
      }

      // 验证时间（不返回）
      const timeStr = `${date} ${time}`;
      try {
        formatInTimeZone(new Date(timeStr), 'Asia/Shanghai', 'yyyy-MM-dd HH:mm:ss');
      } catch  {
        console.warn(`Invalid time format for ${symbol}: ${timeStr}`);
      }

      const changePercent = close !== 0 ? ((price - close) / close) * 100 : 0;
      const change = changePercent >= 0
        ? `+${changePercent.toFixed(2)}%`
        : `${changePercent.toFixed(2)}%`;

      futures.push({
        name,
        price,
        change,
      });
    }

    if (futures.length === 0) {
      console.error('Sina Futures API: No data parsed');
      throw new Error('No futures data parsed');
    }

    return NextResponse.json(futures.slice(0, 8));
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      response?: {
        data?: unknown;
        status?: number;
      };
    };
    
    console.error('Sina Futures API error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
  }
}