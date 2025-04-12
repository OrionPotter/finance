import { NextResponse } from 'next/server';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';

// 定义东财快讯原始类型
interface EastMoneyNewsItem {
  showTime: string;
  title: string;
  summary: string;
}

// 定义响应类型
interface NewsItem {
  time: string;
  title: string;
  summary: string;
}

export async function GET() {
  try {
    const timestamp = Date.now();
    const response = await axios.get<{
      req_trace: string;
      code: string;
      message: string;
      data: { fastNewsList: EastMoneyNewsItem[] } | null;
    }>('https://np-weblist.eastmoney.com/comm/web/getFastNewsList', {
      params: {
        client: 'web',
        biz: 'web_724',
        fastColumn: '102',
        sortEnd: '',
        pageSize: 50,
        req_trace: timestamp - 1, // 模拟差值 1
        _: timestamp, // 当前时间戳
      },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        Referer: 'https://www.eastmoney.com/',
        Origin: 'https://www.eastmoney.com',
      },
      responseType: 'json',
    });

    // 检查响应
    if (!response.data) {
      console.error('EastMoney API: Empty response');
      throw new Error('Empty response');
    }

    if (response.data.code !== '1' || response.data.message !== 'success') {
      console.error('EastMoney API: Invalid response', response.data);
      throw new Error(`Invalid response, code: ${response.data.code}`);
    }

    if (!response.data.data || !response.data.data.fastNewsList) {
      console.error('EastMoney API: No fastNewsList found', response.data);
      throw new Error('No fastNewsList found');
    }

    const formattedNews: NewsItem[] = response.data.data.fastNewsList
      .slice(0, 10)
      .map((item) => ({
        time: formatInTimeZone(
          new Date(item.showTime),
          'Asia/Shanghai',
          'yyyy-MM-dd HH:mm'
        ),
        title: item.title || '无标题',
        summary: item.summary || '暂无摘要',
      }));

    return NextResponse.json(formattedNews);
  } catch (error: any) {
    console.error('EastMoney News API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return NextResponse.json(
      { error: '无法加载东方财富快讯' },
      { status: 500 }
    );
  }
}