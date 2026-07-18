import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Avatar from '@/components/Avatar'
import { mockUserProfile, mockHealthReport } from '@/data/mock'
import styles from './index.module.scss'

export default function MinePage() {
  const menuItems = [
    { icon: '📊', text: '健康报告', path: '/pages/health-report/index' },
    { icon: '📋', text: '体检记录', path: '' },
    { icon: '🏥', text: '我的问诊', path: '/pages/consultation/index' },
    { icon: '🥗', text: '食养方案', path: '/pages/recipes/index' },
    { icon: '🏃', text: '运动记录', path: '' },
    { icon: '💊', text: '用药提醒', path: '' },
    { icon: '🎁', text: '积分兑换', path: '' },
    { icon: '⚙️', text: '设置', path: '' }
  ]

  const handleMenuClick = (path: string) => {
    if (path) {
      Taro.navigateTo({ url: path })
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' })
    }
  }

  const getMemberLevelText = () => {
    switch (mockUserProfile.memberLevel) {
      case 'monthly': return '月度会员'
      case 'yearly': return '年度会员'
      default: return '免费版'
    }
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.userSection}>
          <Avatar src={mockUserProfile.avatar} size="lg" />
          <View className={styles.userInfo}>
            <Text className={styles.userName}>{mockUserProfile.name}</Text>
            <Text className={styles.userPhone}>{mockUserProfile.phone}</Text>
          </View>
          <Text className={styles.memberBadge}>{getMemberLevelText()}</Text>
        </View>
        
        <View className={styles.scoreSection}>
          <View className={styles.scoreItem}>
            <Text className={styles.scoreValue}>1280</Text>
            <Text className={styles.scoreLabel}>健康积分</Text>
          </View>
          <View className={styles.scoreItem}>
            <Text className={styles.scoreValue}>25</Text>
            <Text className={styles.scoreLabel}>连续打卡</Text>
          </View>
          <View className={styles.scoreItem}>
            <Text className={styles.scoreValue}>{mockHealthReport.score}</Text>
            <Text className={styles.scoreLabel}>健康评分</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.memberCard}>
          <View className={styles.memberHeader}>
            <Text className={styles.memberTitle}>会员服务</Text>
            <Text className={styles.memberType}>{getMemberLevelText()}</Text>
          </View>
          <Text className={styles.memberDesc}>
            {mockUserProfile.memberLevel === 'free' 
              ? '升级会员解锁更多专属服务' 
              : `有效期至 ${mockUserProfile.expireDate}`
            }
          </Text>
          <View className={styles.memberButton} onClick={() => Taro.showToast({ title: '会员功能开发中', icon: 'none' })}>
            {mockUserProfile.memberLevel === 'free' ? '立即升级' : '续费会员'}
          </View>
        </View>

        <View className={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View key={index} className={styles.menuItem} onClick={() => handleMenuClick(item.path)}>
              <View className={styles.menuIcon}>
                <Text>{item.icon}</Text>
              </View>
              <Text className={styles.menuText}>{item.text}</Text>
              <Text className={styles.menuArrow}>→</Text>
            </View>
          ))}
        </View>

        <View className={styles.disclaimer}>
          <Text>⚠️ 免责声明：本内容仅作健康调养参考，不能替代医师诊疗。如有严重不适，请及时就医。</Text>
        </View>
      </View>
    </ScrollView>
  )
}
