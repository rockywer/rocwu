import React, { useState, useRef } from 'react'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Card from '@/components/Card'
import Tag from '@/components/Tag'
import WarningModal from '@/components/WarningModal'
import { mockChatMessages, mockBodyConstitution } from '@/data/mock'
import type { ChatMessage } from '@/types'
import { checkCompliance } from '@/utils/compliance'
import styles from './index.module.scss'

export default function ConsultationPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [inputValue, setInputValue] = useState('')
  const [warningModal, setWarningModal] = useState({
    visible: false,
    level: 'low' as 'low' | 'medium' | 'high' | 'critical',
    title: '',
    message: '',
    recommendations: []
  })
  const chatRef = useRef<HTMLDivElement>(null)

  const modes = [
    { icon: '👅', title: '一键舌诊', desc: '拍摄舌头照片，AI自动分析体质' },
    { icon: '📝', title: '体质问卷', desc: '30题标准化问卷，精准辨识体质' },
    { icon: '💬', title: '对话问诊', desc: '描述症状，AI综合分析给出建议' }
  ]

  const handleModeClick = (index: number) => {
    if (index === 0) {
      Taro.showToast({ title: '请拍摄舌头照片', icon: 'none' })
    } else if (index === 1) {
      Taro.showToast({ title: '问卷功能开发中', icon: 'none' })
    } else {
      Taro.showToast({ title: '请在下方输入框提问', icon: 'none' })
    }
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const complianceResult = checkCompliance(inputValue)
    
    if (!complianceResult.isCompliant) {
      setWarningModal({
        visible: true,
        level: complianceResult.riskLevel,
        title: complianceResult.riskLevel === 'critical' ? '紧急情况预警' : '健康咨询提示',
        message: complianceResult.message,
        recommendations: complianceResult.recommendations
      })
      return
    }
    
    const userMsg: ChatMessage = {
      id: `msg${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    
    setTimeout(() => {
      const systemMsg: ChatMessage = {
        id: `msg${Date.now() + 1}`,
        type: 'system',
        content: `根据您的描述，建议您关注饮食调理，适当增加运动。如需更精准的建议，建议进行舌诊或体质问卷测试。\n\n${complianceResult.message}`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, systemMsg])
    }, 1000)
  }

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>AI智能问诊</Text>
        <Text className={styles.headerDesc}>中西医结合，精准辨识体质，给出个性化调理方案</Text>
      </View>

      <View className={styles.content}>
        <Text className={styles.sectionTitle}>问诊方式</Text>
        
        {modes.map((mode, index) => (
          <View key={index} className={styles.modeCard} onClick={() => handleModeClick(index)}>
            <View className={styles.modeIcon}>{mode.icon}</View>
            <View className={styles.modeInfo}>
              <Text className={styles.modeTitle}>{mode.title}</Text>
              <Text className={styles.modeDesc}>{mode.desc}</Text>
            </View>
            <Text className={styles.modeArrow}>→</Text>
          </View>
        ))}

        <View className={styles.divider} />

        <Text className={styles.sectionTitle}>在线咨询</Text>
        
        <View className={styles.chatSection}>
          <ScrollView className={styles.chatArea} scrollY ref={chatRef}>
            {messages.map(msg => (
              <View key={msg.id} className={`${styles.chatMessage} ${msg.type}`}>
                <View className={styles.chatAvatar}>
                  {msg.type === 'system' ? '🤖' : '👤'}
                </View>
                <View className={`${styles.chatContent} ${msg.type}`}>
                  <Text>{msg.content}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          
          <View className={styles.chatInputArea}>
            <Input 
              className={styles.chatInput}
              value={inputValue}
              onChange={(e: any) => setInputValue(e.detail.value)}
              onConfirm={handleSend}
              placeholder="请输入您的健康问题..."
              placeholderStyle="color: #C9CDD4"
            />
            <View className={styles.chatButton} onClick={handleSend}>
              <Text>发送</Text>
            </View>
          </View>
        </View>

        <View className={styles.divider} />

        <Text className={styles.sectionTitle}>我的体质</Text>
        
        <View className={styles.constitutionCard}>
          <View className="flex justify-between items-start">
            <View>
              <Text className={styles.constitutionType}>{mockBodyConstitution.type}</Text>
              <Text className={styles.constitutionScore}>得分: {mockBodyConstitution.score}分 | 测试日期: {mockBodyConstitution.date}</Text>
            </View>
            <Tag type="primary">已辨识</Tag>
          </View>
          
          <Text className={styles.constitutionDesc}>{mockBodyConstitution.description}</Text>
          
          <View className={styles.constitutionSuggestions}>
            <Text className="text-base font-semibold mb-2">调理建议</Text>
            {mockBodyConstitution.suggestions.map((suggestion, index) => (
              <View key={index} className={styles.suggestionItem}>
                <Text className={styles.suggestionIcon}>✓</Text>
                <Text>{suggestion}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.disclaimer}>
          <Text>⚠️ 免责声明：本内容仅作健康调养参考，不能替代医师诊疗。如有严重不适，请及时就医。</Text>
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
