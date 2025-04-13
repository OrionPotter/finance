import { NextResponse } from 'next/server';
import axios from 'axios';

// 定义日历数据类型
interface CalendarItem {
  id: number;
  title: string;
  time: number;
  country: string;
  importance: number;
  actual?: string;
  forecast?: string;
  previous?: string;
  unit?: string;
  period?: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data: {
    items: Array<{
      id: number;
      public_date: number;
      country: string;
      title: string;
      importance: number;
      actual: string;
      forecast: string;
      previous: string;
      unit: string;
      period: string;
    }>;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!start || !end) {
    return NextResponse.json(
      { error: 'Missing start or end parameter' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get<ApiResponse>(
      `https://api-one-wscn.awtmt.com/apiv1/finance/macrodatas?start=${start}&end=${end}`,
      {
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          'Origin': 'https://wallstreetcn.com',
          'Referer': 'https://wallstreetcn.com/',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
          'x-client-type': 'pc',
          'x-device-id': '1962d623-1cda-d562-db03-0718b78e47fd',
          'x-ivanka-app': 'wscn|web|0.40.17|0.0|0',
          'x-ivanka-platform': 'wscn-platform',
          'x-taotie-device-id': '1962d623-1cda-d562-db03-0718b78e47fd',
          'x-track-info': '{"appId":"com.wallstreetcn.web","appVersion":"0.40.17"}',
        },
        timeout: 10000,
      }
    );

    if (response.data.code !== 20000) {
      throw new Error(`API error: ${response.data.message}`);
    }

    const data: CalendarItem[] = (response.data.data.items || []).map((item) => ({
      id: item.id,
      title: item.title || '未知事件',
      time: item.public_date || 0,
      country: item.country || '未知',
      importance: item.importance || 1,
      actual: item.actual || undefined,
      forecast: item.forecast || undefined,
      previous: item.previous || undefined,
      unit: item.unit || undefined,
      period: item.period || undefined,
    }));

    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      response?: { data?: unknown; status?: number };
    };

    console.error('Macrodata API error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });

    return NextResponse.json(
      { error: 'Failed to fetch macrodata' },
      { status: err.response?.status || 500 }
    );
  }
}