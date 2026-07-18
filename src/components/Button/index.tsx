import React from 'react'
import { View } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  type?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const typeMap = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
  outline: styles.buttonOutline,
  ghost: styles.buttonGhost
}

const sizeMap = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg
}

export default function Button({ 
  children, 
  onClick, 
  type = 'primary', 
  size = 'md', 
  disabled = false,
  className 
}: ButtonProps) {
  return (
    <View 
      className={classnames(
        styles.button,
        typeMap[type],
        sizeMap[size],
        disabled && styles.disabled,
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </View>
  )
}
