import React, { useState } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Card from '@/components/Card'
import Tag from '@/components/Tag'
import { mockBodyConstitution } from '@/data/mock'
import styles from './index.module.scss'

export default function StoreServicePage() {
  const [step, setStep] = useState(1)
  const [deviceConnected, setDeviceConnected] = useState(false)

  const serviceSteps = [
    {
      step: 1,
      title: '设备连接',
      desc: '使用门店智能舌诊仪进行检测',
      icon: '📱',
      color: '#2ECC71'
    },
    {
      step: 2,
      title: '体质检测',
      desc: 'AI自动分析舌象特征',
      icon: '👅',
      color: '#3498DB'
    },
    {
      step: 3,
      title: '报告生成',
      desc: '即时输出体质报告',
      icon: '📊',
      color: '#9B59B6'
    },
    {
      step: 4,
      title: '方案推荐',
      desc: '匹配药膳套餐',
      icon: '🥗',
      color: '#E67E22'
    }
  ]

  const recommendedPackages = [
    {
      id: 'pkg001',
      name: '祛湿健脾套餐',
      price: 198,
      originalPrice: 268,
      image: 'https://picsum.photos/id/292/300/300',
      description: '适合痰湿体质，包含7天药膳食材',
      items: ['薏米500g', '红豆500g', '山药300g', '冬瓜2个'],
      tags: ['热销', '店长推荐']
    },
    {
      id: 'pkg002',
      name: '补气养血套餐',
      price: 258,
      originalPrice: 358,
      image: 'https://picsum.photos/id/570/300/300',
      description: '适合气虚体质，包含黄芪、红枣等',
      items: ['黄芪100g', '红枣500g', '枸杞200g', '当归50g'],
      tags: ['滋补']
    },
    {
      id: 'pkg003',
      name: '低糖控脂套餐',
      price: 168,
      originalPrice: 228,
      image: 'https://picsum.photos/id/431/300/300',
      description: '适合三高人群，低GI食材组合',
      items: ['燕麦500g', '糙米500g', '鸡胸肉500g', '西兰花3颗'],
      tags: ['低GI']
    }
  ]

  const handleConnectDevice = () => {
    Taro.showLoading({ title: '正在连接设备...' })
    setTimeout(() => {
      Taro.hideLoading()
      setDeviceConnected(true)
      setStep(2)
      Taro.showToast({ title: '设备连接成功', icon: 'success' })
    }, 2000)
  }

  const handleNextStep = () => {
    if (step < 4) {
      setStep(prev => prev + 1)
    }
  }

  const handleBuyPackage = (packageItem: any) => {
    Taro.showToast({ title: `已添加 ${packageItem.name}`, icon: 'success' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>门店服务</Text>
        <Text className={styles.headerDesc}>到店用户专属服务流程</Text>
      </View>

      <View className={styles.content}>
        <Card className={styles.stepsCard}>
          <Text className={styles.sectionTitle}>服务流程</Text>
          <View className={styles.stepsProgress}>
            {serviceSteps.map((s, index) => (
              <View key={s.step} className={styles.stepWrapper}>
                <View className={`${styles.stepCircle} ${step >= s.step ? styles.active : ''}`}>
                  <Text className={styles.stepIcon}>{s.icon}</Text>
                </View>
                <Text className={`${styles.stepLabel} ${step >= s.step ? styles.active : ''}`}>
                  {s.title}
                </Text>
                {index < serviceSteps.length - 1 && (
                  <View className={`${styles.stepLine} ${step > s.step ? styles.active : ''}`} />
                )}
              </View>
            ))}
          </View>
        </Card>

        {step === 1 && (
          <Card className={styles.actionCard}>
            <Text className={styles.actionTitle}>📱 连接智能舌诊仪</Text>
            <Text className={styles.actionDesc}>请使用门店智能舌诊仪进行检测</Text>
            {deviceConnected ? (
              <View className={styles.deviceConnected}>
                <Text className={styles.connectedIcon}>✓</Text>
                <Text className={styles.connectedText}>设备已连接</Text>
              </View>
            ) : (
              <View className={styles.connectButton} onClick={handleConnectDevice}>
                <Text>连接设备</Text>
              </View>
            )}
            {deviceConnected && (
              <View className={styles.nextButton} onClick={handleNextStep}>
                <Text>开始检测 →</Text>
              </View>
            )}
          </Card>
        )}

        {step === 2 && (
          <Card className={styles.actionCard}>
            <Text className={styles.actionTitle}>👅 体质检测中</Text>
            <Text className={styles.actionDesc}>AI正在分析您的舌象特征...</Text>
            <View className={styles.loadingAnimation}>
              <Text className={styles.loadingIcon}>🧪</Text>
            </View>
            <View className={styles.detectionTips}>
              <Text className={styles.tipItem}>• 正在分析舌色...</Text>
              <Text className={styles.tipItem}>• 正在分析舌苔...</Text>
              <Text className={styles.tipItem}>• 正在分析舌形...</Text>
            </View>
            <View className={styles.nextButton} onClick={handleNextStep}>
              <Text>查看结果 →</Text>
            </View>
          </Card>
        )}

        {step === 3 && (
          <Card className={styles.resultCard}>
            <Text className={styles.resultTitle}>📊 体质检测报告</Text>
            <View className={styles.constitutionResult}>
              <Text className={styles.constitutionType}>{mockBodyConstitution.type}</Text>
              <Tag type="primary">已辨识</Tag>
            </View>
            <Text className={styles.constitutionDesc}>{mockBodyConstitution.description}</Text>
            <View className={styles.suggestionsList}>
              {mockBodyConstitution.suggestions.map((suggestion, index) => (
                <View key={index} className={styles.suggestionItem}>
                  <Text className={styles.suggestionIcon}>✓</Text>
                  <Text>{suggestion}</Text>
                </View>
              ))}
            </View>
            <View className={styles.nextButton} onClick={handleNextStep}>
              <Text>查看推荐套餐 →</Text>
            </View>
          </Card>
        )}

        {step === 4 && (
          <Card className={styles.packagesCard}>
            <Text className={styles.sectionTitle}>🥗 推荐药膳套餐</Text>
            {recommendedPackages.map(pkg => (
              <View key={pkg.id} className={styles.packageItem}>
                <Image className={styles.packageImage} src={pkg.image} mode="aspectFill" />
                <View className={styles.packageInfo}>
                  <View className={styles.packageHeader}>
                    <Text className={styles.packageName}>{pkg.name}</Text>
                    {pkg.tags.map((tag, index) => (
                      <Tag key={index} type="warning">{tag}</Tag>
                    ))}
                  </View>
                  <Text className={styles.packageDesc}>{pkg.description}</Text>
                  <View className={styles.packageItems}>
                    {pkg.items.map((item, index) => (
                      <Text key={index} className={styles.packageItemTag}>{item}</Text>
                    ))}
                  </View>
                  <View className={styles.packageFooter}>
                    <View className={styles.priceSection}>
                      <Text className={styles.price}>¥{pkg.price}</Text>
                      <Text className={styles.originalPrice}>¥{pkg.originalPrice}</Text>
                    </View>
                    <View className={styles.buyButton} onClick={() => handleBuyPackage(pkg)}>
                      <Text>加入购物车</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        )}

        {step === 4 && (
          <Card className={styles.followUpCard}>
            <Text className={styles.followUpTitle}>📅 后续服务</Text>
            <View className={styles.followUpItems}>
              <View className={styles.followUpItem}>
                <Text className={styles.followUpIcon}>📝</Text>
                <View className={styles.followUpInfo}>
                  <Text className={styles.followUpName}>周期饮食打卡</Text>
                  <Text className={styles.followUpDesc}>购买后自动绑定7天打卡服务</Text>
                </View>
              </View>
              <View className={styles.followUpItem}>
                <Text className={styles.followUpIcon}>🔔</Text>
                <View className={styles.followUpInfo}>
                  <Text className={styles.followUpName}>回访提醒</Text>
                  <Text className={styles.followUpDesc}>每周健康回访，调整调理方案</Text>
                </View>
              </View>
            </View>
          </Card>
        )}
      </View>

      <View className={styles.disclaimer}>
        <Text>⚠️ 本服务仅提供健康调养参考，不能替代医师诊疗</Text>
      </View>
    </ScrollView>
  )
}