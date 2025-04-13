'use client';

import { useState, useEffect } from 'react';
import styles from './home.module.css';
import Link from 'next/link';

export default function Home() {
  // 功能导航数据
  const navItems = [
    {
      title: '市场行情',
      description: '追踪全球市场动态',
      href: '/market',
      icon: '📈',
    },
    {
      title: '交易计算',
      description: '计算收益与成本',
      href: '/TCalculator',
      icon: '🧮',
    },
    {
      title: '持仓分析',
      description: '优化投资组合',
      href: '/portfolio',
      icon: '📊',
    },
    {
      title: '汇率换算',
      description: '实时货币转换',
      href: '/currency',
      icon: '💱',
    },
  ];

  // 实时行情数据（8项）
  const [marketData, setMarketData] = useState([
    { name: '上证指数', price: 3200.45, change: '+1.23%', trend: 'up' },
    { name: '深证成指', price: 10500.67, change: '-0.45%', trend: 'down' },
    { name: '恒生指数', price: 22000.89, change: '+0.78%', trend: 'up' },
    { name: '纳斯达克', price: 14500.12, change: '+0.32%', trend: 'up' },
    { name: '标普500', price: 4500.78, change: '-0.15%', trend: 'down' },
  ]);

  // 热门资讯（6条）
  const [newsItems] = useState([
    {
      title: '美联储加息预期升温，全球市场波动加剧',
      time: '2025-04-13 10:30',
    },
    {
      title: 'A股政策利好落地，科技股强势反弹',
      time: '2025-04-13 09:15',
    },
    {
      title: '黄金价格创三周新高，避险需求增加',
      time: '2025-04-13 08:45',
    },
    {
      title: '比特币突破6.5万美元，创年内新高',
      time: '2025-04-13 07:30',
    },
    {
      title: '欧盟财政刺激计划公布，欧元持续走强',
      time: '2025-04-13 06:20',
    },
    {
      title: '科技巨头财报季开启，市场关注AI增长',
      time: '2025-04-13 05:00',
    },
  ]);

  // 金融日历（6条）
  const [calendarEvents] = useState([
    { time: '2025-04-13 14:00', event: '美国CPI数据发布' },
    { time: '2025-04-13 16:30', event: '苹果公司财报公布' },
    { time: '2025-04-13 20:00', event: '欧洲央行利率决议' },
    { time: '2025-04-14 09:00', event: '中国GDP数据公布' },
    { time: '2025-04-14 15:00', event: '英国零售销售数据' },
    { time: '2025-04-14 18:00', event: '美联储会议纪要' },
  ]);

  // 加载状态
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // 模拟行情数据刷新
    const interval = setInterval(() => {
      setMarketData((prev) =>
        prev.map((item) => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * 10,
          change: Math.random() > 0.5 ? `+${(Math.random() * 2).toFixed(2)}%` : `-${(Math.random() * 2).toFixed(2)}%`,
          trend: Math.random() > 0.5 ? 'up' : 'down',
        }))
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 截断标题
  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* 实时行情 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>实时行情</h2>
          <div className={styles.marketGrid}>
            {isLoading
              ? Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className={`${styles.card} ${styles.skeleton} ${styles.marketCard}`}
                    >
                      <div className={styles.skeletonTitle}></div>
                      <div className={styles.skeletonValue}></div>
                      <div className={styles.skeletonChange}></div>
                    </div>
                  ))
              : marketData.map((item, index) => (
                  <Link href="/market" key={index} className={styles.cardLink}>
                    <div
                      className={`${styles.card} ${styles.marketCard}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <h3 className={styles.cardTitle}>{item.name}</h3>
                      <p
                        className={`${styles.cardValue} ${
                          item.trend === 'up' ? styles.valuePositive : styles.valueNegative
                        }`}
                      >
                        {item.price.toFixed(2)}
                        <span className={styles.trendIcon}>
                          {item.trend === 'up' ? '↑' : '↓'}
                        </span>
                      </p>
                      <p
                        className={`${styles.cardChange} ${
                          item.trend === 'up' ? styles.positive : styles.negative
                        }`}
                      >
                        {item.change}
                      </p>
                    </div>
                  </Link>
                ))}
          </div>
        </section>

        {/* 热门资讯和金融日历 */}
        <div className={styles.infoCalendarWrapper}>
          {/* 热门资讯（左侧） */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>热门资讯</h2>
            {!isLoading && (
                <Link href="/news" className={styles.moreLink}>
                  查看更多
                </Link>
              )}
            <div className={styles.newsList}>
              {isLoading
                ? Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className={`${styles.card} ${styles.skeleton} ${styles.newsCard}`}
                      >
                        <div className={styles.skeletonTime}></div>
                        <div className={styles.skeletonTitle}></div>
                      </div>
                    ))
                : newsItems.map((item, index) => (
                    <Link href="/news" key={index} className={styles.cardLink}>
                      <div
                        className={`${styles.card} ${styles.newsCard}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className={styles.newsContent}>
                          <span className={styles.cardTime}>{item.time}</span>
                          <h3 className={styles.cardTitle}>
                            {truncateText(item.title, 35)}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
              
            </div>
          </section>

          {/* 金融日历（右侧） */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>金融日历</h2>
            {!isLoading && (
                <Link href="/calendar" className={styles.moreLink}>
                  查看更多
                </Link>
              )}
            <div className={styles.calendarList}>
              {isLoading
                ? Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className={`${styles.card} ${styles.skeleton} ${styles.calendarCard}`}
                      >
                        <div className={styles.skeletonTime}></div>
                        <div className={styles.skeletonTitle}></div>
                      </div>
                    ))
                : calendarEvents.map((item, index) => (
                    <Link href="/calendar" key={index} className={styles.cardLink}>
                      <div
                        className={`${styles.card} ${styles.calendarCard}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className={styles.calendarContent}>
                          <span className={styles.cardTime}>{item.time}</span>
                          <h3 className={styles.calendarTitle}>{item.event}</h3>
                        </div>
                      </div>
                    </Link>
                  ))}
              
            </div>
          </section>
        </div>

        {/* 功能导航 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>功能导航</h2>
          <div className={styles.navGrid}>
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`${styles.cardLink} ${styles.navCardLink}`}
              >
                <div
                  className={`${styles.card} ${styles.navCard}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.navContent}>
                    <span className={styles.cardIcon}>{item.icon}</span>
                    <h2 className={styles.cardTitle}>{item.title}</h2>
                  </div>
                  <p className={styles.cardDescription}>{item.description}</p>
                  <span className={styles.cardArrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 背景装饰 */}
        <div className={styles.backgroundWave}></div>
        <div className={styles.backgroundOrb}></div>
      </div>
    </main>
  );
}