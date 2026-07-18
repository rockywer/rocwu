import React from 'react'
import { View, Text } from '@tarojs/components'
import Card from '../Card'
import Tag from '../Tag'
import type { HealthRecord } from '@/types'
import { getStatusColor, getRecordTypeName } from '@/utils/format'
import styles from './index.module.scss'

interface HealthCardProps {
  record: HealthRecord
}

export default function HealthCard({ record }: HealthCardProps) {
  const statusColor = getStatusColor(record.status)
  const typeName = getRecordTypeName(record.type)
  
  return (
    <Card className={styles.healthCard}>
      <View className={styles.header}>
        <Text className={styles.typeName}>{typeName}</Text>
        <Tag type={record.status === 'normal' ? 'success' : record.status === 'warning' ? 'warning' : 'error'}>
          {record.status === 'normal' ? '正常' : record.status === 'warning' ? '偏高' : '异常'}
        </Tag>
      </View>
      <View className={styles.valueSection}>
        <Text className={styles.value} style={{ color: statusColor }}>{record.value}</Text>
        <Text className={styles.unit}>{record.unit}</Text>
      </View>
      <View className={styles.footer}>
        <Text className={styles.date}>{record.date}</Text>
      </View>
    </Card>
  )
}
