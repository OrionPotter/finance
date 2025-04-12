'use client';

import styles from './styles.module.css';

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* 标题 */}
        <h1 className={styles.title}>关于 Finance</h1>
        <p className={styles.subtitle}>连接财富，赋能未来</p>

        {/* 简介卡片 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>我们的使命</h2>
          <p className={styles.cardDescription}>
            Finance 致力于通过前沿科技，简化投资决策，为全球用户提供精准、高效的金融工具。我们相信，每个人都应拥有掌控财富的机会。
          </p>
        </div>

        {/* 核心价值 */}
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>创新驱动</h3>
            <p className={styles.cardDescription}>
              我们不断探索金融科技边界，开发智能工具如 TCalculator，助您在复杂市场中游刃有余。
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>用户至上</h3>
            <p className={styles.cardDescription}>
              以用户需求为核心，打造直观、优雅的体验，确保每一步操作都简单可靠。
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>全球视野</h3>
            <p className={styles.cardDescription}>
              连接全球市场，提供多场景解决方案，助力用户实现跨境财富增长。
            </p>
          </div>
        </div>

        {/* 团队介绍 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>我们的团队</h2>
          <p className={styles.cardDescription}>
            Finance 由一群金融专家、数据科学家和产品设计师组成，共同打造行业领先的工具。我们结合深厚的市场洞察与技术创新，为用户创造价值。
          </p>
        </div>

        {/* 背景装饰 */}
        <div className={styles.backgroundOrb}></div>
        <div className={styles.backgroundOrbRight}></div>
      </div>
    </main>
  );
}