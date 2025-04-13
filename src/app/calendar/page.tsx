'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

// 定义日历数据类型
interface CalendarItem {
  id: number;
  title: string;
  time: number; // public_date
  country: string;
  importance: number;
  actual?: string;
  forecast?: string;
  previous?: string;
  unit?: string;
  period?: string;
}

export default function FinanceCalendar() {
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showDetails, setShowDetails] = useState<boolean>(false); // 控制实际值等显示

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
        const endTimestamp = Math.floor(
          new Date(endDate).setHours(23, 59, 59, 999) / 1000
        );
        const response = await axios.get<CalendarItem[]>(
          `/api/calendar?start=${startTimestamp}&end=${endTimestamp}`
        );
        // 按时间排序
        const sortedItems = response.data.sort((a, b) => a.time - b.time);
        setCalendarItems(sortedItems);
        setError(null);
      } catch {
        setError('无法加载日历数据，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
    const interval = setInterval(fetchCalendar, 60000); // 每分钟更新
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>全球金融日历</h1>

        {/* 时间筛选和字段切换 */}
        <div className={styles.filters}>
          <label className={styles.filterLabel}>
            开始日期：
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.filterLabel}>
            结束日期：
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.input}
            />
          </label>
          <button
            className={styles.toggleButton}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '隐藏详情' : '显示详情'}
          </button>
        </div>

        {loading && <p className={styles.loading}>加载中...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && calendarItems.length === 0 && (
          <p className={styles.empty}>暂无日历数据</p>
        )}

        {!loading && !error && calendarItems.length > 0 && (
          <div className={styles.eventList}>
            {calendarItems.map((item) => (
              <div
                key={item.id}
                className={styles.eventCard}
                style={{ '--index': calendarItems.indexOf(item) } as React.CSSProperties}
              >
                <span className={styles.eventTime}>
                  {new Date(item.time * 1000).toLocaleString('zh-CN', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
                <span className={styles.eventName}>{item.title}</span>
                <span className={styles.eventCountry}>{item.country}</span>
                <span
                  className={`${styles.eventImportance} ${
                    item.importance === 3
                      ? styles.high
                      : item.importance === 2
                      ? styles.medium
                      : styles.low
                  }`}
                >
                  {item.importance === 3 ? '高' : item.importance === 2 ? '中' : '低'}
                </span>
                {showDetails && (
                  <div className={styles.eventDetails}>
                    {item.actual && (
                      <span className={styles.eventDetail}>
                        实际: {item.actual} {item.unit || ''}
                      </span>
                    )}
                    {item.forecast && (
                      <span className={styles.eventDetail}>
                        预测: {item.forecast} {item.unit || ''}
                      </span>
                    )}
                    {item.previous && (
                      <span className={styles.eventDetail}>
                        前值: {item.previous} {item.unit || ''}
                      </span>
                    )}
                  </div>
                )}
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