import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { mockChronicConditions, mockHealthRecords } from '@/data/mock'
import WarningModal from '@/components/WarningModal'
import styles from './index.module.scss'

export default function ChronicPage() {
  const [warningModal, setWarningModal] = useState({
    visible: false,
    level: 'low' as 'low' | 'medium' | 'high' | 'critical',
    title: '',
    message: '',
    recommendations: []
  })

  useEffect(() => {
    const highRiskRecords = mockHealthRecords.filter(r => r.status === 'danger' || (r.status === 'warning' && r.type === 'bloodPressure'))
    if (highRiskRecords.length > 0) {
      setTimeout(() => {
        setWarningModal({
          visible: true,
          level: 'high',
          title: '血压指标异常预警',
          message: '您的血压测量值偏高，建议密切关注并调整饮食。如持续偏高，请及时就医。',
          recommendations: [
            '减少钠盐摄入，每天不超过5克',
            '增加钾的摄入，多吃蔬菜和水果',
            '避免油腻和辛辣食物',
            '保持规律作息，避免熬夜'
          ]
        })
      }, 1500)
    }
  }, [])
  const conditionNames: Record<string, string> = {
    hypertension: '高血压',
    diabetes: '糖尿病',
    hyperlipidemia: '高血脂',
    gout: '痛风',
    obesity: '肥胖'
  }

  const redLineFoods = ['高糖食物', '高油食物', '高盐食物', '高嘌呤食物', '酒精饮料', '精制碳水']

  const exercises = [
    { icon: '🚶', name: '快走', desc: '每天30分钟，心率控制在100-120次/分钟' },
    { icon: '🏊', name: '游泳', desc: '每周2-3次，每次20-30分钟' },
    { icon: '🧘', name: '太极', desc: '每天15-20分钟，舒缓身心' },
    { icon: '🚴', name: '骑自行车', desc: '每周2-3次，每次30分钟' }
  ]

  const recordItems = [
    { icon: '🩸', name: '血压', value: '125/80', unit: 'mmHg' },
    { icon: '🧪', name: '血糖', value: '5.8', unit: 'mmol/L' },
    { icon: '⚖️', name: '体重', value: '72', unit: 'kg' }
  ]

  const handleRecord = (type: string) => {
    if (type === '血压') {
      setWarningModal({
        visible: true,
        level: 'medium',
        title: '血压值输入',
        message: '请输入您的血压测量值，系统将自动评估风险等级。',
        recommendations: []
      })
    } else if (type === '血糖') {
      setWarningModal({
        visible: true,
        level: 'low',
        title: '血糖监测提醒',
        message: '建议定期监测血糖，空腹血糖正常值范围为3.9-6.1mmol/L。',
        recommendations: [
          '保持规律饮食，定时定量',
          '避免高糖食物和饮料',
          '适当进行有氧运动'
        ]
      })
    } else {
      Taro.showToast({ title: `${type}记录功能开发中`, icon: 'none' })
    }
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>慢病管理</Text>
        <Text className={styles.headerDesc}>持续监测，科学管理，有效控制慢病风险</Text>
      </View>

      <View className={styles.content}>
        <Text className={styles.sectionTitle}>我的慢病</Text>
        
        {mockChronicConditions.map(condition => (
          <View key={condition.type} className={styles.conditionCard}>
            <View className={styles.conditionHeader}>
              <Text className={styles.conditionName}>{conditionNames[condition.type]}</Text>
              <Text className={`${styles.conditionStatus} ${condition.status}`}>
                {condition.status === 'controlled' ? '控制良好' : '需关注'}
              </Text>
            </View>
            <View className={styles.conditionBody}>
              <View className={styles.conditionItem}>
                <Text className={styles.conditionLabel}>当前值</Text>
                <Text className={styles.conditionValue}>{condition.current}</Text>
              </View>
              <View className={styles.conditionItem}>
                <Text className={styles.conditionLabel}>目标值</Text>
                <Text className={styles.conditionValue}>{condition.target}</Text>
              </View>
              <View className={styles.conditionItem}>
                <Text className={styles.conditionLabel}>下次复查</Text>
                <Text className={styles.conditionValue}>{condition.nextCheckDate}</Text>
              </View>
            </View>
          </View>
        ))}

        <View className={styles.divider} />

        <Text className={styles.sectionTitle}>快速记录</Text>
        
        <View className={styles.recordCard}>
          <View className={styles.recordGrid}>
            {recordItems.map((item, index) => (
              <View key={index} className={styles.recordItem} onClick={() => handleRecord(item.name)}>
                <Text className={styles.recordIcon}>{item.icon}</Text>
                <Text className={styles.recordName}>{item.name}</Text>
                <Text className="text-base font-semibold text-text-primary">{item.value}</Text>
                <Text className="text-xs text-text-auxiliary">{item.unit}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.divider} />

        <Text className={styles.sectionTitle}>饮食红线</Text>
        
        <View className={styles.redLineCard}>
          <Text className={styles.redLineTitle}>⚠️ 建议避免或减少摄入</Text>
          <View className={styles.redLineList}>
            {redLineFoods.map((food, index) => (
              <Text key={index} className={styles.redLineItem}>{food}</Text>
            ))}
          </View>
        </View>

        <View className={styles.divider} />

        <Text className={styles.sectionTitle}>运动处方</Text>
        
        <View className={styles.exerciseCard}>
          <Text className={styles.exerciseTitle}>🏃 每周运动建议</Text>
          {exercises.map((exercise, index) => (
            <View key={index} className={styles.exerciseItem}>
              <View className={styles.exerciseIcon}>
                <Text>{exercise.icon}</Text>
              </View>
              <View className={styles.exerciseInfo}>
                <Text className={styles.exerciseName}>{exercise.name}</Text>
                <Text className={styles.exerciseDesc}>{exercise.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <WarningModal
        visible={warningModal.visible}
        onClose={() => setWarningModal(prev => ({ ...prev, visible: false }))}
        level={warningModal.level}
        title={warningModal.title}
        message={warningModal.message}
        recommendations={warningModal.recommendations}
      />
    </ScrollView>
  )
}
