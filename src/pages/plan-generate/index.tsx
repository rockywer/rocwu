import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { mockRecipes, mockBodyConstitution } from '@/data/mock'
import styles from './index.module.scss'

export default function PlanGeneratePage() {
  const [isGenerating, setIsGenerating] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { icon: '📋', text: '收集健康数据' },
    { icon: '🧪', text: '体质辨识分析' },
    { icon: '🥗', text: '定制食养方案' },
    { icon: '✅', text: '方案生成完成' }
  ]

  const planDays = [
    {
      day: 1,
      breakfast: '薏米红豆粥',
      lunch: '清蒸鲈鱼 + 清炒西兰花',
      dinner: '山药百合粥',
      tea: '黄芪红枣茶',
      exercise: '快走30分钟'
    },
    {
      day: 2,
      breakfast: '燕麦牛奶 + 水煮蛋',
      lunch: '冬瓜海带排骨汤 + 杂粮饭',
      dinner: '小米粥 + 凉拌黄瓜',
      tea: '荷叶茶',
      exercise: '太极20分钟'
    },
    {
      day: 3,
      breakfast: '红枣小米粥',
      lunch: '红烧鸡胸肉 + 清炒菠菜',
      dinner: '蔬菜豆腐汤',
      tea: '枸杞菊花茶',
      exercise: '快走30分钟'
    },
    {
      day: 4,
      breakfast: '全麦面包 + 鸡蛋羹',
      lunch: '清蒸鱼 + 水煮青菜',
      dinner: '南瓜粥',
      tea: '山楂茶',
      exercise: '游泳30分钟'
    },
    {
      day: 5,
      breakfast: '杂粮粥',
      lunch: '瘦肉炒芹菜 + 糙米饭',
      dinner: '凉拌苦瓜 + 白粥',
      tea: '决明子茶',
      exercise: '快走30分钟'
    },
    {
      day: 6,
      breakfast: '豆浆 + 全麦馒头',
      lunch: '清炖鸡汤 + 蔬菜沙拉',
      dinner: '小米粥 + 清蒸虾',
      tea: '玫瑰花茶',
      exercise: '太极20分钟'
    },
    {
      day: 7,
      breakfast: '薏米粥',
      lunch: '凉拌鸡丝 + 杂粮饭',
      dinner: '冬瓜薏米汤',
      tea: '甘草茶',
      exercise: '快走30分钟'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        clearInterval(timer)
        setTimeout(() => {
          setIsGenerating(false)
        }, 500)
      }
    }, 800)
    return () => clearInterval(timer)
  }, [currentStep])

  const handleViewPlan = () => {
    Taro.setStorageSync('healthPlan', planDays)
    Taro.switchTab({ url: '/pages/home/index' })
  }

  const handleBuyIngredients = () => {
    Taro.setStorageSync('healthPlan', planDays)
    Taro.navigateTo({ url: '/pages/recipes/index' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>定制专属调养方案</Text>
        <Text className={styles.headerDesc}>AI正在为您生成7天入门调养方案</Text>
      </View>

      {isGenerating ? (
        <View className={styles.generatingContent}>
          <View className={styles.loadingAnimation}>
            <Text className={styles.loadingIcon}>🌿</Text>
          </View>
          
          <View className={styles.stepsList}>
            {steps.map((step, index) => (
              <View key={index} className={`${styles.stepItem} ${index <= currentStep ? styles.active : ''}`}>
                <View className={`${styles.stepIcon} ${index <= currentStep ? styles.active : ''}`}>
                  <Text>{step.icon}</Text>
                </View>
                <Text className={`${styles.stepText} ${index <= currentStep ? styles.active : ''}`}>
                  {step.text}
                </Text>
                {index <= currentStep && index < steps.length - 1 && (
                  <View className={styles.stepLine} />
                )}
              </View>
            ))}
          </View>

          <Text className={styles.generatingText}>正在分析您的体质和健康数据...</Text>
        </View>
      ) : (
        <View className={styles.planContent}>
          <View className={styles.successCard}>
            <View className={styles.successIcon}>🎉</View>
            <Text className={styles.successTitle}>方案生成成功！</Text>
            <Text className={styles.successDesc}>根据您的体质特征，为您定制了7天入门调养方案</Text>
            
            <View className={styles.constitutionInfo}>
              <Text className={styles.constitutionLabel}>当前体质</Text>
              <Text className={styles.constitutionValue}>{mockBodyConstitution.type}</Text>
            </View>
          </View>

          <View className={styles.planCard}>
            <Text className={styles.planTitle}>📅 7天调养方案预览</Text>
            {planDays.slice(0, 3).map(day => (
              <View key={day.day} className={styles.dayItem}>
                <View className={styles.dayHeader}>
                  <Text className={styles.dayNumber}>第 {day.day} 天</Text>
                </View>
                <View className={styles.mealList}>
                  <View className={styles.mealItem}>
                    <Text className={styles.mealIcon}>🌅</Text>
                    <Text className={styles.mealText}>{day.breakfast}</Text>
                  </View>
                  <View className={styles.mealItem}>
                    <Text className={styles.mealIcon}>☀️</Text>
                    <Text className={styles.mealText}>{day.lunch}</Text>
                  </View>
                  <View className={styles.mealItem}>
                    <Text className={styles.mealIcon}>🌙</Text>
                    <Text className={styles.mealText}>{day.dinner}</Text>
                  </View>
                  <View className={styles.mealItem}>
                    <Text className={styles.mealIcon}>🍵</Text>
                    <Text className={styles.mealText}>{day.tea}</Text>
                  </View>
                </View>
                <View className={styles.exerciseItem}>
                  <Text className={styles.exerciseIcon}>🏃</Text>
                  <Text className={styles.exerciseText}>{day.exercise}</Text>
                </View>
              </View>
            ))}
            
            <View className={styles.viewAllButton} onClick={handleViewPlan}>
              <Text>查看完整方案</Text>
            </View>
          </View>

          <View className={styles.actionButtons}>
            <View className={styles.actionButton} onClick={handleBuyIngredients}>
              <Text>🛒 一键购菜</Text>
            </View>
            <View className={styles.actionButtonPrimary} onClick={handleViewPlan}>
              <Text>开始调养</Text>
            </View>
          </View>
        </View>
      )}

      <View className={styles.disclaimer}>
        <Text>⚠️ 本方案为药食同源健康调养指导，仅用于日常亚健康调理与生活方式干预，不替代专业医师诊断与治疗，身体不适请及时前往正规医疗机构就诊。</Text>
      </View>
    </ScrollView>
  )
}