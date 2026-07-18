import React from 'react'
import { Image, View } from '@tarojs/components'
import styles from './index.module.scss'

interface AvatarProps {
  src?: string
  size?: 'sm' | 'md' | 'lg'
  shape?: 'circle' | 'square'
  icon?: React.ReactNode
}

const sizeMap = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg
}

const shapeMap = {
  circle: styles.shapeCircle,
  square: styles.shapeSquare
}

export default function Avatar({ src, size = 'md', shape = 'circle', icon }: AvatarProps) {
  return (
    <View className={`${styles.avatar} ${sizeMap[size]} ${shapeMap[shape]}`}>
      {src ? (
        <Image className={styles.image} src={src} mode="aspectFill" />
      ) : icon ? (
        icon
      ) : (
        <View className={styles.placeholder}>
          <Text className={styles.placeholderText}>头像</Text>
        </View>
      )}
    </View>
  )
}
