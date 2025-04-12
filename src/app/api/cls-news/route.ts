import { NextResponse } from 'next/server';
import axios from 'axios';
import { format } from 'date-fns';

// 定义新闻项类型
interface ClsNewsItem {
  id: number;
  title: string;
  content: string;
  ctime: number;
}

interface NewsItem {
  time: string;
  title: string;
  summary: string;
}

export async function GET() {
  try {
    const response = await axios.get<{ data: ClsNewsItem[] }>(
      'https://www.cls.cn/nodeapi/telegraphs',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        },
        params: {
          last_time: '',
          app: 'CailianpressWeb',
          os: 'web',
          sv: '8.4.2',
        },
      }
    );

    const formattedNews: NewsItem[] = response.data.data
      .slice(0, 10)
      .map((item) => ({
        time: format(new Date(item.ctime * 1000), 'yyyy-MM-dd HH:mm'),
        title: item.title || '无标题',
        summary: item.content || '暂无摘要',
      }));

    return NextResponse.json(formattedNews);
  } catch (error) {
    console.error('CLS News API error:', error);
    return NextResponse.json(
      { error: '无法加载财联社新闻' },
      { status: 500 }
    );
  }
}