import React from 'react'
import { View } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface TagProps {
  children?: React.ReactNode
  type?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  className?: string
}

const typeMap = {
  primary: styles.tagPrimary,
  success: styles.tagSuccess,
  warning: styles.tagWarning,
  error: styles.tagError,
  info: styles.tagInfo
}

const sizeMap = {
  sm: styles.sizeSm,
  md: styles.sizeMd
}

export default function Tag({ children, type = 'primary', size = 'sm', className }: TagProps) {
  return (
    <View className={classnames(styles.tag, typeMap[type], sizeMap[size], className)}>
      {children}
    </View>
  )
}
