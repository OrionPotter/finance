'use client';

import styles from './styles.module.css';

export default function News() {
  // 模拟实时消息数据，新增摘要
  const newsItems = [
    {
      time: '2025-04-12 15:30',
      title: 'A股指数午后反弹，创业板涨超2%',
      summary: '受科技股推动，创业板指领涨，市场成交额突破8000亿元。',
    },
    {
      time: '2025-04-12 15:15',
      title: '央行：保持货币政策稳健，支持实体经济',
      summary: '最新表态强调流动性合理充裕，市场预期降准可能性降低。',
    },
    {
      time: '2025-04-12 14:50',
      title: '新能源板块走强，锂电池概念股领涨',
      summary: '政策利好叠加需求回暖，宁德时代等龙头股涨幅超5%。',
    },
    {
      time: '2025-04-12 14:20',
      title: '美股期货小幅上涨，市场关注通胀数据',
      summary: '投资者静待下周CPI报告，纳斯达克100期货表现优于标普。',
    },
    {
      time: '2025-04-12 13:45',
      title: '证监会：推动资本市场高质量发展',
      summary: '监管层强调优化IPO审核，吸引长期资金入市。',
    },
    {
      time: '2025-04-12 13:10',
      title: '科技股盘中异动，半导体板块获资金青睐',
      summary: '芯片制造企业订单回升，机构看好行业复苏前景。',
    },
    {
      time: '2025-04-12 12:30',
      title: '人民币汇率企稳，离岸价格小幅回升',
      summary: '美元指数回落，人民币市场情绪有所改善。',
    },
    {
      time: '2025-04-12 11:55',
      title: '房地产政策优化，多地调整限购措施',
      summary: '一线城市楼市松绑，部分区域成交量环比上升。',
    },
    {
      time: '2025-04-12 11:20',
      title: '国际油价震荡，布伦特原油突破90美元',
      summary: '地缘政治因素推高油价，能源股普遍上涨。',
    },
    {
      time: '2025-04-12 10:40',
      title: '消费电子迎旺季，供应链订单增加',
      summary: '苹果新品发布临近，相关厂商股价表现活跃。',
    },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>实时掌握全球金融动态</h1>
    
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

        {/* 背景装饰 */}
        <div className={styles.backgroundOrb}></div>
        <div className={styles.backgroundOrbRight}></div>
      </div>
    </main>
  );
}