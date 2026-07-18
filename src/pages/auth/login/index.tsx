import React, { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleWechatLogin = () => {
    setIsLoading(true)
    Taro.login({
      success: () => {
        setTimeout(() => {
          setIsLoading(false)
          Taro.setStorageSync('isLoggedIn', true)
          Taro.navigateTo({ url: '/pages/auth/questionnaire' })
        }, 1500)
      },
      fail: () => {
        setIsLoading(false)
        Taro.showToast({ title: '登录失败，请重试', icon: 'none' })
      }
    })
  }

  const handleGuestLogin = () => {
    Taro.setStorageSync('isLoggedIn', true)
    Taro.switchTab({ url: '/pages/home/index' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.logoSection}>
        <View className={styles.logo}>🌿</View>
        <Text className={styles.appName}>青禾大健康</Text>
        <Text className={styles.appSlogan}>中西医结合 · 药食同源 · 智能调养</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.featureList}>
          <View className={styles.featureItem}>
            <Text className={styles.featureIcon}>🤖</Text>
            <Text className={styles.featureText}>AI智能舌诊</Text>
          </View>
          <View className={styles.featureItem}>
            <Text className={styles.featureIcon}>📋</Text>
            <Text className={styles.featureText}>体质辨识</Text>
          </View>
          <View className={styles.featureItem}>
            <Text className={styles.featureIcon}>🥗</Text>
            <Text className={styles.featureText}>药膳定制</Text>
          </View>
          <View className={styles.featureItem}>
            <Text className={styles.featureIcon}>📊</Text>
            <Text className={styles.featureText}>健康监测</Text>
          </View>
        </View>

        <View className={styles.loginCard}>
          <View className={styles.loginButton} onClick={handleWechatLogin}>
            <Text className={styles.loginIcon}>💬</Text>
            <Text className={styles.loginText}>微信一键登录</Text>
            {isLoading && <Text className={styles.loginLoading}>...</Text>}
          </View>
          
          <View className={styles.divider}>
            <View className={styles.dividerLine} />
            <Text className={styles.dividerText}>其他登录方式</Text>
            <View className={styles.dividerLine} />
          </View>

          <View className={styles.guestButton} onClick={handleGuestLogin}>
            <Text className={styles.guestText}>游客体验</Text>
          </View>
        </View>

        <View className={styles.privacyText}>
          <Text>登录即表示同意</Text>
          <Text className={styles.link}>《用户协议》</Text>
          <Text>和</Text>
          <Text className={styles.link}>《隐私政策》</Text>
        </View>
      </View>

      <View className={styles.disclaimer}>
        <Text>⚠️ 本产品仅提供健康调养参考，不能替代医师诊疗</Text>
      </View>
    </View>
  )
}