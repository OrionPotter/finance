'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

// 定义新闻项类型
interface NewsItem {
  time: string;
  title: string;
  summary: string;
}

export default function News() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取新闻数据
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get<NewsItem[]>('/api/eastmoney-news');
        setNewsItems(response.data);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.error || '无法加载快讯，请稍后重试'
        );
        console.error('Fetch news error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    // 每 60 秒轮询
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
        7*24小时时讯{' '}
        </h1>

        {loading && <p className={styles.loading}>加载中...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && newsItems.length === 0 && (
          <p className={styles.empty}>暂无快讯数据</p>
        )}

        {!loading && !error && newsItems.length > 0 && (
          <div className={styles.newsList}>
            {newsItems.map((item, index) => (
              <div
                key={index}
                className={styles.newsCard}
                style={{ '--index': index } as React.CSSProperties}
              >
                <span className={styles.newsTime}>{item.time}</span>
                <div className={styles.newsContent}>
                  <h3 className={styles.newsTitle}>{item.title}</h3>
                  <p className={styles.newsSummary}>{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 背景装饰 */}
        <div className={styles.backgroundOrb}></div>
        <div className={styles.backgroundOrbRight}></div>
      </div>
    </main>
  );
}