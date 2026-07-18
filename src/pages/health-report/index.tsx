import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { mockHealthReport, mockBodyConstitution } from '@/data/mock'
import styles from './index.module.scss'

export default function HealthReportPage() {
  const [activePeriod, setActivePeriod] = useState('7day')

  const periods = [
    { key: '7day', label: '7天' },
    { key: '30day', label: '30天' },
    { key: '90day', label: '90天' }
  ]

  const indicators = [
    { name: '血压', avg: '125/82 mmHg', trend: 'down', trendText: '下降' },
    { name: '血糖', avg: '5.6 mmol/L', trend: 'stable', trendText: '稳定' },
    { name: '睡眠', avg: '7.2小时/晚', trend: 'up', trendText: '改善' },
    { name: '体重', avg: '68.5 kg', trend: 'down', trendText: '下降' },
    { name: '运动', avg: '4.5次/周', trend: 'up', trendText: '增加' }
  ]

  const suggestions = [
    '继续保持低脂低盐饮食，建议每周增加1次有氧运动',
    '血压控制良好，建议定期监测，避免情绪波动',
    '睡眠质量有所改善，建议保持规律作息时间',
    '体质略有改善，建议配合药膳调理效果更佳'
  ]

  const handleGenerate = () => {
    Taro.showToast({ title: '报告生成中...', icon: 'loading' })
    setTimeout(() => {
      Taro.showToast({ title: '报告已更新', icon: 'success' })
    }, 1500)
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>健康报告</Text>
        <Text className={styles.headerDesc}>定期回顾您的健康数据</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.periodTabs}>
          {periods.map(period => (
            <View 
              key={period.key} 
              className={`${styles.periodTab} ${activePeriod === period.key ? styles.active : ''}`}
              onClick={() => setActivePeriod(period.key)}
            >
              <Text>{period.label}</Text>
            </View>
          ))}
        </View>

        <View className={styles.scoreCard}>
          <View className={styles.scoreCircle}>
            <Text className={styles.scoreValue}>{mockHealthReport.score}</Text>
          </View>
          <Text className={styles.scoreLabel}>健康评分</Text>
          <Text className={styles.scoreDesc}>综合评估您的健康状况</Text>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>📝 健康概况</Text>
          <Text className={styles.summaryText}>
            {mockHealthReport.summary}
          </Text>
          <Text className={styles.summaryText}>
            当前体质：{mockBodyConstitution.type}
          </Text>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>📊 指标趋势</Text>
          {indicators.map((indicator, index) => (
            <View key={index} className={styles.indicatorItem}>
              <View className={styles.indicatorInfo}>
                <Text className={styles.indicatorName}>{indicator.name}</Text>
                <Text className={styles.indicatorAvg}>平均值 {indicator.avg}</Text>
              </View>
              <View className={styles.indicatorTrend}>
                <Text className={styles.trendIcon}>
                  {indicator.trend === 'up' ? '↑' : indicator.trend === 'down' ? '↓' : '→'}
                </Text>
                <Text className={`${styles.trendText} ${styles[indicator.trend]}`}>
                  {indicator.trendText}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>💡 调养建议</Text>
          {suggestions.map((suggestion, index) => (
            <View key={index} className={styles.suggestionItem}>
              <Text className={styles.suggestionIcon}>✓</Text>
              <Text>{suggestion}</Text>
            </View>
          ))}
          
          <View className={styles.actionButton} onClick={handleGenerate}>
            <Text>重新生成报告</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
