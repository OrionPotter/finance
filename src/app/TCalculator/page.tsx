'use client'; // 客户端组件

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import styles from './styles.module.css';

// 定义表单数据的类型
type FormData = {
  initialShares: string; // 初始持仓股数
  initialCost: string; // 初始持仓成本
  tBuyPrice: string; // T买入价格
  tBuyQuantity: string; // T买入数量
  tSellPrice: string; // T卖出价格
  tSellQuantity: string; // T卖出数量
};

// 定义计算结果的类型
type Result = {
  initialTotalCost?: string; // 初始持仓总成本
  tBuyTotalCost?: string; // T买入总成本
  tSellTotalIncome?: string; // T卖出总收入
  tProfit?: string; // 做T收益
  tProfitRate?: string; // 做T收益率
  finalShares?: string; // 最终持仓股数
  finalCost?: string; // 最终持仓成本
  costReduction?: string; // 持仓成本下降
  tBuyCommission?: string; // T买入佣金
  tBuyTransferFee?: string; // T买入过户费
  tSellCommission?: string; // T卖出佣金
  tSellTransferFee?: string; // T卖出过户费
  tSellStampTax?: string; // T卖出印花税
  error?: string; // 错误信息
};

// 定义历史记录的类型
type HistoryRecord = Result & { timestamp: string };

export default function StockCalculator() {
  // 表单状态
  const [formData, setFormData] = useState<FormData>({
    initialShares: '',
    initialCost: '',
    tBuyPrice: '',
    tBuyQuantity: '',
    tSellPrice: '',
    tSellQuantity: '',
  });

  // 计算结果状态
  const [result, setResult] = useState<Result | null>(null);

  // 历史记录状态
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // 手续费说明弹窗状态
  const [showFeeModal, setShowFeeModal] = useState(false);

  // 加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('tTradeHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 保存历史记录
  const saveHistory = (newResult: Result) => {
    const timestamp = new Date().toLocaleString('zh-CN');
    const newRecord: HistoryRecord = { ...newResult, timestamp };
    const updatedHistory = [newRecord, ...history].slice(0, 10); // 最多10条
    setHistory(updatedHistory);
    localStorage.setItem('tTradeHistory', JSON.stringify(updatedHistory));
  };

  // 处理输入变化
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 重置表单
  const handleReset = () => {
    setFormData({
      initialShares: '',
      initialCost: '',
      tBuyPrice: '',
      tBuyQuantity: '',
      tSellPrice: '',
      tSellQuantity: '',
    });
    setResult(null);
  };

  // 计算做T交易
  const calculateTTrade = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 转换为数字
    const initialShares = parseInt(formData.initialShares, 10);
    const initialCost = parseFloat(formData.initialCost);
    const tBuyPrice = parseFloat(formData.tBuyPrice);
    const tBuyQuantity = parseInt(formData.tBuyQuantity, 10);
    const tSellPrice = parseFloat(formData.tSellPrice);
    const tSellQuantity = parseInt(formData.tSellQuantity, 10);

    // 验证输入
    if (
      isNaN(initialShares) ||
      isNaN(initialCost) ||
      initialShares < 0 ||
      initialCost < 0 ||
      isNaN(tBuyPrice) ||
      isNaN(tBuyQuantity) ||
      isNaN(tSellPrice) ||
      isNaN(tSellQuantity) ||
      tBuyPrice < 0 ||
      tBuyQuantity < 0 ||
      tSellPrice < 0 ||
      tSellQuantity < 0
    ) {
      setResult({ error: '请填写所有字段，并确保输入有效非负数字' });
      return;
    }

    // 验证卖出数量
    const maxSellable = initialShares + tBuyQuantity;
    if (tSellQuantity > maxSellable) {
      setResult({ error: '卖出数量不能超过可用持仓（初始持仓 + T买入数量）' });
      return;
    }

    // A股交易费用
    const commissionRate = 0.0001; // 万分之一
    const transferFeeRate = 0.00001; // 万分之0.1
    const stampTaxRate = 0.0005; // 万分之五

    // 计算初始持仓总成本
    const initialTotalCost = initialShares * initialCost;

    // 计算T买入费用
    const tBuyAmount = tBuyPrice * tBuyQuantity;
    const tBuyCommission = tBuyAmount * commissionRate;
    const tBuyTransferFee = tBuyAmount * transferFeeRate;
    const tBuyTotalCost = tBuyAmount + tBuyCommission + tBuyTransferFee;

    // 计算T卖出费用
    const tSellAmount = tSellPrice * tSellQuantity;
    const tSellCommission = tSellAmount * commissionRate;
    const tSellTransferFee = tSellAmount * transferFeeRate;
    const tSellStampTax = tSellAmount * stampTaxRate;
    const tSellTotalIncome = tSellAmount - (tSellCommission + tSellTransferFee + tSellStampTax);

    // 计算做T收益
    const tProfit = tSellTotalIncome - tBuyTotalCost;

    // 计算做T收益率
    const tProfitRate = tBuyTotalCost > 0 ? (tProfit / tBuyTotalCost) * 100 : 0;

    // 计算最终持仓股数
    const finalShares = initialShares + tBuyQuantity - tSellQuantity;

    // 计算最终持仓成本
    const finalTotalCost = initialTotalCost + tBuyTotalCost - tSellTotalIncome;
    const finalCost = finalShares > 0 ? finalTotalCost / finalShares : 0;

    // 计算持仓成本下降
    const costReduction = initialCost - finalCost;

    const newResult: Result = {
      initialTotalCost: initialTotalCost.toFixed(2),
      tBuyTotalCost: tBuyTotalCost.toFixed(2),
      tSellTotalIncome: tSellTotalIncome.toFixed(2),
      tProfit: tProfit.toFixed(2),
      tProfitRate: tProfitRate.toFixed(2),
      finalShares: finalShares.toString(),
      finalCost: finalCost.toFixed(2),
      costReduction: costReduction.toFixed(2),
      tBuyCommission: tBuyCommission.toFixed(2),
      tBuyTransferFee: tBuyTransferFee.toFixed(2),
      tSellCommission: tSellCommission.toFixed(2),
      tSellTransferFee: tSellTransferFee.toFixed(2),
      tSellStampTax: tSellStampTax.toFixed(2),
    };

    setResult(newResult);
    saveHistory(newResult);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>T交易计算器</h1>

      <form onSubmit={calculateTTrade} className={styles.form}>
        <div className={styles.formCard}>
          <div className={styles.formCardHeader}>
            <h2 className={styles.formCardTitle}>初始持仓</h2>
            <button
              type="button"
              className={styles.feeTipButton}
              onClick={() => setShowFeeModal(true)}
              title="手续费说明"
            >
              i
            </button>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="initialShares">持仓股数</label>
            <input
              type="number"
              id="initialShares"
              name="initialShares"
              value={formData.initialShares}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="initialCost">持仓成本</label>
            <input
              type="number"
              id="initialCost"
              name="initialCost"
              value={formData.initialCost}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
        </div>

        <div className={styles.formCard}>
          <h2 className={styles.formCardTitle}>T买入</h2>
          <div className={styles.formGroup}>
            <label htmlFor="tBuyPrice">买入价格</label>
            <input
              type="number"
              id="tBuyPrice"
              name="tBuyPrice"
              value={formData.tBuyPrice}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="tBuyQuantity">买入数量</label>
            <input
              type="number"
              id="tBuyQuantity"
              name="tBuyQuantity"
              value={formData.tBuyQuantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formCard}>
          <h2 className={styles.formCardTitle}>T卖出</h2>
          <div className={styles.formGroup}>
            <label htmlFor="tSellPrice">卖出价格</label>
            <input
              type="number"
              id="tSellPrice"
              name="tSellPrice"
              value={formData.tSellPrice}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="tSellQuantity">卖出数量</label>
            <input
              type="number"
              id="tSellQuantity"
              name="tSellQuantity"
              value={formData.tSellQuantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.calculateButton}>
            计算
          </button>
          <button type="button" onClick={handleReset} className={styles.resetButton}>
            重置
          </button>
        </div>
      </form>

      {showFeeModal && (
        <div className={styles.modalOverlay} onClick={() => setShowFeeModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>手续费说明</h2>
            <div className={styles.modalContent}>
              <h3>买入手续费</h3>
              <p>买入总成本 = 买入金额 + 佣金 + 过户费</p>
              <ul>
                <li>佣金 = 买入金额 × 0.01%（万分之一）</li>
                <li>过户费 = 买入金额 × 0.001%（万分之0.1）</li>
              </ul>
              <h3>卖出手续费</h3>
              <p>卖出总收入 = 卖出金额 - (佣金 + 过户费 + 印花税)</p>
              <ul>
                <li>佣金 = 卖出金额 × 0.01%（万分之一）</li>
                <li>过户费 = 卖出金额 × 0.001%（万分之0.1）</li>
                <li>印花税 = 卖出金额 × 0.05%（万分之五）</li>
              </ul>
              <p>注：本计算器采用万一免五佣金，无最低5元限制。</p>
            </div>
            <button className={styles.modalCloseButton} onClick={() => setShowFeeModal(false)}>
              关闭
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className={styles.result}>
          {result.error ? (
            <p className={styles.error}>{result.error}</p>
          ) : (
            <div className={styles.resultCard}>
              <h2 className={styles.resultCardTitle}>计算结果</h2>
              <div className={styles.resultSection}>
                <h3>持仓信息</h3>
                <div className={styles.resultItem}>
                  <span>初始持仓总成本</span>
                  <span>¥{result.initialTotalCost}</span>
                </div>
                <div className={styles.resultItem}>
                  <span>最终持仓股数</span>
                  <span>{result.finalShares}</span>
                </div>
                <div className={styles.resultItem}>
                  <span>最终持仓成本</span>
                  <span>¥{result.finalCost}</span>
                </div>
                <div className={styles.resultItem}>
                  <span>持仓成本下降</span>
                  <span>¥{result.costReduction}</span>
                </div>
              </div>
              <div className={styles.resultSection}>
                <h3>T交易信息</h3>
                <div className={styles.resultItem}>
                  <span>T买入总成本</span>
                  <span>¥{result.tBuyTotalCost}</span>
                </div>
                <div className={styles.resultItem}>
                  <span>T卖出总收入</span>
                  <span>¥{result.tSellTotalIncome}</span>
                </div>
                <div className={styles.resultItem}>
                  <span>做T收益</span>
                  <span>¥{result.tProfit}</span>
                </div>
                <div className={styles.resultItem}>
                  <span>做T收益率</span>
                  <span>{result.tProfitRate}%</span>
                </div>
              </div>
              <div className={styles.resultSection}>
                <h3>税费详情</h3>
                <div className={styles.resultItem}>
                  <span>T买入佣金</span>
                  <span>¥{result.tBuyCommission}</span>
                </div>
                <div className={styles.resultItem}>
                  <span>T买入过户费</span>
                  <span>¥{result.tBuyTransferFee}</span>
                </div>
                <div className={styles.resultItem}>
                  <span>T卖出佣金</span>
                  <span>¥{result.tSellCommission}</span>
                </div>
                <div className={styles.resultItem}>
                  <span>T卖出过户费</span>
                  <span>¥{result.tSellTransferFee}</span>
                </div>
                <div className={styles.resultItem}>
                  <span>T卖出印花税</span>
                  <span>¥{result.tSellStampTax}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.historyToggle}>
        <button onClick={() => setShowHistory(!showHistory)} className={styles.historyButton}>
          {showHistory ? '隐藏历史记录' : '查看历史记录'}
        </button>
      </div>

      {showHistory && (
        <div className={styles.history}>
          <h2 className={styles.historyTitle}>历史记录</h2>
          {history.length === 0 ? (
            <p className={styles.historyEmpty}>暂无历史记录</p>
          ) : (
            <div className={styles.historyList}>
              {history.map((record, index) => (
                <div key={index} className={styles.historyCard}>
                  <p>
                    <strong>时间:</strong> {record.timestamp}
                  </p>
                  <p>
                    <strong>初始持仓总成本:</strong> ¥{record.initialTotalCost}
                  </p>
                  <p>
                    <strong>T买入总成本:</strong> ¥{record.tBuyTotalCost}
                  </p>
                  <p>
                    <strong>T卖出总收入:</strong> ¥{record.tSellTotalIncome}
                  </p>
                  <p>
                    <strong>做T收益:</strong> ¥{record.tProfit}
                  </p>
                  <p>
                    <strong>做T收益率:</strong> {record.tProfitRate}%
                  </p>
                  <p>
                    <strong>最终持仓股数:</strong> {record.finalShares}
                  </p>
                  <p>
                    <strong>最终持仓成本:</strong> ¥{record.finalCost}
                  </p>
                  <p>
                    <strong>持仓成本下降:</strong> ¥{record.costReduction}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}