import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

interface WarningModalProps {
  visible: boolean
  onClose: () => void
  level: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  recommendations: string[]
  isEmergency?: boolean
}

export default function WarningModal({ visible, onClose, level, title, message, recommendations, isEmergency }: WarningModalProps) {
  if (!visible) return null

  const levelConfig = {
    low: { color: '#FFB800', bg: 'rgba(255, 184, 0, 0.1)', icon: '⚠️', label: '轻度异常' },
    medium: { color: '#FF7D00', bg: 'rgba(255, 125, 0, 0.1)', icon: '⛔', label: '中度风险' },
    high: { color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.1)', icon: '🚨', label: '重度危急' },
    critical: { color: '#D93026', bg: 'rgba(217, 48, 38, 0.1)', icon: '🆘', label: '急症' }
  }

  const config = levelConfig[level]

  const handleGoToHospital = () => {
    Taro.showToast({ title: '正在定位附近医疗机构...', icon: 'loading' })
    setTimeout(() => {
      Taro.showToast({ title: '已为您推荐附近医院', icon: 'success' })
      onClose()
    }, 1500)
  }

  return (
    <View className={styles.modalOverlay} onClick={onClose}>
      <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <View className={styles.warningHeader} style={{ background: config.bg }}>
          <Text className={styles.warningIcon}>{config.icon}</Text>
          <Text className={styles.warningLevel} style={{ color: config.color }}>{config.label}</Text>
        </View>

        <View className={styles.warningBody}>
          <Text className={styles.warningTitle}>{title}</Text>
          <Text className={styles.warningMessage}>{message}</Text>

          {recommendations.length > 0 && (
            <View className={styles.recommendations}>
              <Text className={styles.recommendationsTitle}>💡 临时饮食建议</Text>
              {recommendations.map((item, index) => (
                <View key={index} className={styles.recommendationItem}>
                  <Text className={styles.recommendationIcon}>✓</Text>
                  <Text>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {level === 'high' || level === 'critical' ? (
            <View className={styles.emergencySection}>
              <Text className={styles.emergencyText}>
                {level === 'critical' 
                  ? '紧急情况：请立即前往医院就诊！' 
                  : '建议尽快前往医院复查确诊'}
              </Text>
              <View className={styles.emergencyButton} onClick={handleGoToHospital}>
                <Text>📍 查找附近医院</Text>
              </View>
            </View>
          ) : (
            <View className={styles.actionButton} onClick={onClose}>
              <Text>我知道了</Text>
            </View>
          )}
        </View>

        <View className={styles.disclaimer}>
          <Text>本提示仅供健康参考，不能替代专业医疗诊断</Text>
        </View>
      </View>
    </View>
  )
}