'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function Futures() {
  // 模拟期货行情数据
  const [futuresData, setFuturesData] = useState([
    {
      name: '纳斯达克100期货',
      price: 17350.75,
      change: 0.42,
    },
    {
      name: '标普500期货',
      price: 5050.20,
      change: -0.15,
    },
    {
      name: 'VIX波动率指数',
      price: 37.25,
      change: 2.85,
    },
    {
      name: '上证50期货',
      price: 2685.30,
      change: 1.12,
    },
    {
      name: '10年期国债',
      price: 4.18,
      change: -0.03,
    },
    {
      name: '波罗的海BDI指数',
      price: 1274,
      change: 5,
    },
    {
      name: '黄金期货',
      price: 2700,
      change: 0.85,
    },
    {
      name: '沪深300期货',
      price: 4000.50,
      change: -0.25,
    },
  ]);

  // 模拟实时更新
  useEffect(() => {
    const interval = setInterval(() => {
      setFuturesData((prev) =>
        prev.map((item) => ({
          ...item,
          price: item.name.includes('国债')
            ? Number((item.price + (Math.random() - 0.5) * 0.02).toFixed(2))
            : Number((item.price + (Math.random() - 0.5) * 10).toFixed(item.name.includes('黄金') ? 0 : 2)),
          change: Number(((Math.random() - 0.5) * 2).toFixed(2)),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          期货市场行情 <span className={styles.titleEn}>Futures Market</span>
        </h1>
        <p className={styles.subtitle}>实时追踪A股与美股关键指数</p>

        <div className={styles.futuresGrid}>
          {futuresData.map((item, index) => (
            <div
              key={index}
              className={styles.futuresCard}
              style={{ '--index': index } as React.CSSProperties}
            >
              <h3 className={styles.cardTitle}>{item.name}</h3>
              <p
                className={`${styles.cardPrice} ${
                  item.change >= 0 ? styles.positive : styles.negative
                }`}
              >
                {item.price.toLocaleString(undefined, {
                  minimumFractionDigits: item.name.includes('黄金') || item.name.includes('国债') ? 2 : 2,
                  maximumFractionDigits: item.name.includes('黄金') || item.name.includes('国债') ? 2 : 2,
                })}
              </p>
              <span
                className={`${styles.cardChange} ${
                  item.change >= 0 ? styles.positive : styles.negative
                }`}
              >
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        {/* 背景装饰 */}
        <div className={styles.backgroundOrb}></div>
        <div className={styles.backgroundOrbRight}></div>
      </div>
    </main>
  );
}