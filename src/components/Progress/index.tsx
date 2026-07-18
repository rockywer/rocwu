import React from 'react'
import { View } from '@tarojs/components'
import styles from './index.module.scss'

interface ProgressProps {
  percent: number
  showText?: boolean
  color?: string
  height?: number
}

export default function Progress({ percent, showText = false, color = '#2ECC71', height = 8 }: ProgressProps) {
  return (
    <View className={styles.progressContainer}>
      <View className={styles.progressBar}>
        <View 
          className={styles.progressFill} 
          style={{ width: `${Math.min(100, Math.max(0, percent))}%`, background: color }}
        />
      </View>
      {showText && (
        <Text className={styles.progressText}>{Math.round(percent)}%</Text>
      )}
    </View>
  )
}
