'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

// 定义期货数据类型（无 time）
interface FuturesItem {
  name: string;
  price: number;
  change: string;
}

export default function Futures() {
  const [futuresItems, setFuturesItems] = useState<FuturesItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFutures = async () => {
      try {
        setLoading(true);
        const response = await axios.get<FuturesItem[]>('/api/futures');
        setFuturesItems(response.data);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.error || '无法加载期货数据，请稍后重试'
        );
        console.error('Fetch futures error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFutures();
    const interval = setInterval(fetchFutures, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          实时期货市场动态{' '}
        </h1>

        {loading && <p className={styles.loading}>加载中...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && futuresItems.length === 0 && (
          <p className={styles.empty}>暂无期货数据</p>
        )}

        {!loading && !error && futuresItems.length > 0 && (
          <div className={styles.futuresList}>
            {futuresItems.map((item, index) => (
              <div
                key={index}
                className={styles.futuresCard}
                style={{ '--index': index } as React.CSSProperties}
              >
                <span className={styles.futuresName}>{item.name}</span>
                <span className={styles.futuresPrice}>
                  {item.price.toFixed(2)}
                </span>
                <span
                  className={`${styles.futuresChange} ${
                    item.change.startsWith('+')
                      ? styles.positive
                      : item.change.startsWith('-')
                      ? styles.negative
                      : ''
                  }`}
                >
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.backgroundOrb}></div>
        <div className={styles.backgroundOrbRight}></div>
      </div>
    </main>
  );
}