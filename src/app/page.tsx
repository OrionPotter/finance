'use client';

import Link from 'next/link';
import styles from './home.module.css';

export default function Home() {
  // 导航卡片数据
  const navItems = [
    {
      title: '7*24小时时讯',
      description: '实时掌握全球金融动态',
      href: '/news',
    },
    {
      title: '期货市场行情',
      description: '追踪A股与美股关键期货数据',
      href: '/futures',
    },
    {
      title: 'T交易收益计算',
      description: '计算 A股做T交易的成本和收益',
      href: '/TCalculator',
    },
    {
      title: '帮助中心',
      description: '了解如何使用我们的工具',
      href: '/help',
    },
    {
      title: '关于我们',
      description: '认识 Finance 团队与使命',
      href: '/about',
    },
    {
      title: '关于我们',
      description: '认识 Finance 团队与使命',
      href: '/about',
    },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Finance 导航</h1>
        <p className={styles.subtitle}>探索我们的工具与服务</p>

        <div className={styles.cardGrid}>
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} className={styles.cardLink}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardDescription}>{item.description}</p>
                <span className={styles.cardArrow}>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* 背景装饰 */}
        <div className={styles.backgroundOrb}></div>
        <div className={styles.backgroundOrbRight}></div>
      </div>
    </main>
  );
}