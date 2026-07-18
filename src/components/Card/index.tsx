import React from 'react'
import { View } from '@tarojs/components'
import styles from './index.module.scss'

interface CardProps {
  children?: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddingMap = {
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
  none: styles.paddingNone
}

export default function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <View className={`${styles.card} ${paddingMap[padding]} ${className || ''}`}>
      {children}
    </View>
  )
}
