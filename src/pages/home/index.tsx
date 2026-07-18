import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import Tag from '@/components/Tag'
import Button from '@/components/Button'
import { mockUserProfile, mockHealthRecords, mockBodyConstitution, mockCheckInRecords } from '@/data/mock'
import { getBMI, getBMICategory, getRecordTypeName } from '@/utils/format'
import styles from './index.module.scss'

export default function HomePage() {
  const [checkInData, setCheckInData] = useState(mockCheckInRecords[0])
  const todayRecords = mockHealthRecords.filter(r => r.date === '2026-07-16')
  const bmi = getBMI(mockUserProfile.weight, mockUserProfile.height)
  const bmiInfo = getBMICategory(bmi)

  const quickActions = [
    { icon: '🏥', text: 'AI问诊', path: '/pages/consultation/index' },
    { icon: '👅', text: '舌诊', path: '/pages/consultation/index' },
    { icon: '🥗', text: '食养方案', path: '/pages/recipes/index' },
    { icon: '📊', text: '健康报告', path: '/pages/health-report/index' }
  ]

  const checkInItems = [
    { key: 'diet', icon: '🍽️', text: '饮食' },
    { key: 'exercise', icon: '🏃', text: '运动' },
    { key: 'sleep', icon: '😴', text: '睡眠' },
    { key: 'medication', icon: '💊', text: '服药' }
  ]

  const handleCheckIn = (key: 'diet' | 'exercise' | 'sleep' | 'medication') => {
    setCheckInData(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAction = (path: string) => {
    Taro.navigateTo({ url: path })
  }

  const handleViewRecords = () => {
    Taro.switchTab({ url: '/pages/chronic/index' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.userSection}>
          <Avatar src={mockUserProfile.avatar} size="lg" />
          <View className={styles.userInfo}>
            <Text className={styles.userName}>{mockUserProfile.name}</Text>
            <Text className={styles.userStats}>
              {mockUserProfile.age}岁 | 身高{mockUserProfile.height}cm | 体重{mockUserProfile.weight}kg
            </Text>
          </View>
          <Tag className={styles.memberBadge}>{mockUserProfile.memberLevel === 'monthly' ? '月度会员' : mockUserProfile.memberLevel === 'yearly' ? '年度会员' : '免费版'}</Tag>
        </View>
        
        <View className={styles.quickActions}>
          {quickActions.map((action, index) => (
            <View 
              key={index} 
              className={styles.actionItem} 
              onClick={() => handleAction(action.path)}
            >
              <View className={styles.actionIcon}>{action.icon}</View>
              <Text className={styles.actionText}>{action.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.content}>
        <Text className={styles.sectionTitle}>今日健康指标</Text>
        <View className={styles.healthGrid}>
          {todayRecords.slice(0, 2).map(record => (
            <Card key={record.id} className={styles.healthCard}>
              <View className={styles.header}>
                <Text className={styles.typeName}>{getRecordTypeName(record.type)}</Text>
                <Tag type={record.status === 'normal' ? 'success' : record.status === 'warning' ? 'warning' : 'error'}>
                  {record.status === 'normal' ? '正常' : record.status === 'warning' ? '偏高' : '异常'}
                </Tag>
              </View>
              <View className={styles.valueSection}>
                <Text className={styles.value} style={{ color: record.status === 'normal' ? '#00B42A' : '#FF7D00' }}>
                  {record.value}
                </Text>
                <Text className={styles.unit}>{record.unit}</Text>
              </View>
            </Card>
          ))}
        </View>

        <Card className={styles.sectionCard}>
          <View className={styles.recordItem}>
            <Text className={styles.recordName}>体重</Text>
            <Text className={styles.recordValue}>{mockUserProfile.weight}kg</Text>
          </View>
          <View className={styles.recordItem}>
            <Text className={styles.recordName}>BMI</Text>
            <View className="flex items-center gap-2">
              <Text className={styles.recordValue}>{bmi}</Text>
              <Tag type={bmiInfo.color === '#00B42A' ? 'success' : bmiInfo.color === '#FF7D00' ? 'warning' : 'error'}>
                {bmiInfo.text}
              </Tag>
            </View>
          </View>
          <View className={styles.recordItem}>
            <Text className={styles.recordName}>体质类型</Text>
            <Text className={styles.recordValue}>{mockBodyConstitution.type}</Text>
          </View>
          <View className={styles.recordItem} onClick={handleViewRecords}>
            <Text className={styles.recordName}>查看更多记录</Text>
            <Text className="text-primary">→</Text>
          </View>
        </Card>

        <View className={styles.checkInSection}>
          <Text className={styles.sectionTitle}>今日健康打卡</Text>
          <View className={styles.checkInGrid}>
            {checkInItems.map(item => (
              <View key={item.key} className={styles.checkInItem} onClick={() => handleCheckIn(item.key as any)}>
                <View className={`${styles.checkInIcon} ${checkInData[item.key as keyof typeof checkInData] ? styles.checked : ''}`}>
                  {item.icon}
                </View>
                <Text className={styles.checkInText}>{item.text}</Text>
              </View>
            ))}
          </View>
          <Text className={styles.checkInStatus}>
            已完成 {Object.values(checkInData).filter(Boolean).length}/4
          </Text>
        </View>

        <View className={styles.bannerCard}>
          <Text className={styles.bannerTitle}>📅 健康报告已生成</Text>
          <Text className={styles.bannerDesc}>查看您最近30天的健康变化趋势</Text>
          <View className={styles.bannerButton} onClick={() => Taro.navigateTo({ url: '/pages/health-report/index' })}>
            查看报告
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
