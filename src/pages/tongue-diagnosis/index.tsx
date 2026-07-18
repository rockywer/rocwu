import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

export default function TongueDiagnosisPage() {
  const [imagePath, setImagePath] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleCamera = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        setImagePath(res.tempFilePaths[0])
      },
      fail: () => {
        Taro.showToast({ title: '图片选择失败', icon: 'none' })
      }
    })
  }

  const handleAnalysis = () => {
    if (!imagePath) {
      Taro.showToast({ title: '请先拍摄舌头照片', icon: 'none' })
      return
    }

    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      Taro.setStorageSync('tongueImage', imagePath)
      Taro.navigateTo({ url: '/pages/tongue-result/index' })
    }, 3000)
  }

  const tips = [
    '拍摄前请保持口腔清洁',
    '自然伸出舌头，不要用力',
    '光线充足，避免阴影',
    '舌头放松，露出舌尖和舌面'
  ]

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>AI智能舌诊</Text>
        <Text className={styles.headerDesc}>拍摄舌头照片，AI自动分析您的体质特征</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.cameraCard}>
          <View className={styles.cameraArea} onClick={handleCamera}>
            {imagePath ? (
              <Image className={styles.previewImage} src={imagePath} mode="aspectFill" />
            ) : (
              <View className={styles.cameraPlaceholder}>
                <Text className={styles.cameraIcon}>📷</Text>
                <Text className={styles.cameraText}>点击拍摄舌头照片</Text>
                <Text className={styles.cameraSubText}>或从相册选择</Text>
              </View>
            )}
          </View>
          
          {imagePath && (
            <View className={styles.photoActions}>
              <View className={styles.actionButton} onClick={handleCamera}>
                <Text>重新拍摄</Text>
              </View>
              <View className={`${styles.actionButton} ${styles.actionButtonPrimary}`} onClick={handleAnalysis}>
                {isAnalyzing ? (
                  <Text>分析中...</Text>
                ) : (
                  <Text>开始分析</Text>
                )}
              </View>
            </View>
          )}
        </View>

        <View className={styles.tipsCard}>
          <Text className={styles.tipsTitle}>💡 拍摄小贴士</Text>
          {tips.map((tip, index) => (
            <View key={index} className={styles.tipItem}>
              <Text className={styles.tipIcon}>✓</Text>
              <Text className={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View className={styles.skipButton} onClick={() => Taro.navigateTo({ url: '/pages/plan-generate/index' })}>
          <Text>跳过舌诊，直接生成方案</Text>
        </View>
      </View>

      <View className={styles.disclaimer}>
        <Text>⚠️ 舌诊结果仅作健康参考，不能替代专业医师诊断</Text>
      </View>
    </View>
  )
}