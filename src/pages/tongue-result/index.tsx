import React from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { mockBodyConstitution } from '@/data/mock'
import styles from './index.module.scss'

export default function TongueResultPage() {
  const analysis = {
    color: '淡红',
    coating: '薄白',
    shape: '正常',
    cracks: false,
    teethMarks: false
  }

  const handleViewRecipes = () => {
    Taro.navigateTo({ url: '/pages/recipes/index' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>舌诊分析结果</Text>
        <Text className={styles.headerDesc}>AI智能分析您的舌象特征</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.resultCard}>
          <Image 
            className={styles.tongueImage} 
            src="https://picsum.photos/id/91/750/400" 
            mode="aspectFill" 
          />
          
          <View className={styles.analysisSection}>
            <View className={styles.analysisItem}>
              <Text className={styles.analysisLabel}>舌色</Text>
              <Text className={styles.analysisValue}>{analysis.color}</Text>
            </View>
            <View className={styles.analysisItem}>
              <Text className={styles.analysisLabel}>舌苔</Text>
              <Text className={styles.analysisValue}>{analysis.coating}</Text>
            </View>
            <View className={styles.analysisItem}>
              <Text className={styles.analysisLabel}>舌形</Text>
              <Text className={styles.analysisValue}>{analysis.shape}</Text>
            </View>
            <View className={styles.analysisItem}>
              <Text className={styles.analysisLabel}>裂纹</Text>
              <Text className={styles.analysisValue}>{analysis.cracks ? '有' : '无'}</Text>
            </View>
            <View className={styles.analysisItem}>
              <Text className={styles.analysisLabel}>齿痕</Text>
              <Text className={styles.analysisValue}>{analysis.teethMarks ? '有' : '无'}</Text>
            </View>
          </View>
        </View>

        <View className={styles.constitutionCard}>
          <Text className={styles.constitutionType}>体质判定：{mockBodyConstitution.type}</Text>
          <Text className={styles.constitutionDesc}>{mockBodyConstitution.description}</Text>
        </View>

        <View className={styles.suggestionsCard}>
          <Text className={styles.suggestionsTitle}>💡 调理建议</Text>
          {mockBodyConstitution.suggestions.map((suggestion, index) => (
            <View key={index} className={styles.suggestionItem}>
              <Text className={styles.suggestionIcon}>✓</Text>
              <Text>{suggestion}</Text>
            </View>
          ))}
          
          <View className={styles.actionButton} onClick={handleViewRecipes}>
            <Text>查看推荐食谱</Text>
          </View>
        </View>

        <View className={styles.disclaimer}>
          <Text>⚠️ 免责声明：本内容仅作健康调养参考，不能替代医师诊疗。如有严重不适，请及时就医。</Text>
        </View>
      </View>
    </ScrollView>
  )
}
