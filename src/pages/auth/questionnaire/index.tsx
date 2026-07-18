import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

const questions = [
  {
    id: 'q1',
    question: '您的年龄是？',
    options: ['18-25岁', '26-35岁', '36-45岁', '46-55岁', '56岁以上'],
    type: 'single'
  },
  {
    id: 'q2',
    question: '您的性别？',
    options: ['男', '女'],
    type: 'single'
  },
  {
    id: 'q3',
    question: '您容易疲劳吗？',
    options: ['从不', '很少', '有时', '经常', '总是'],
    type: 'single'
  },
  {
    id: 'q4',
    question: '您容易气短吗？',
    options: ['从不', '很少', '有时', '经常', '总是'],
    type: 'single'
  },
  {
    id: 'q5',
    question: '您容易出汗吗？',
    options: ['从不', '很少', '有时', '经常', '总是'],
    type: 'single'
  },
  {
    id: 'q6',
    question: '您手脚冰凉吗？',
    options: ['从不', '很少', '有时', '经常', '总是'],
    type: 'single'
  },
  {
    id: 'q7',
    question: '您口干咽燥吗？',
    options: ['从不', '很少', '有时', '经常', '总是'],
    type: 'single'
  },
  {
    id: 'q8',
    question: '您有既往病史吗？（可多选）',
    options: ['无', '高血压', '糖尿病', '高血脂', '痛风', '其他'],
    type: 'multiple'
  },
  {
    id: 'q9',
    question: '您有食物过敏史吗？',
    options: ['无', '有，请在备注中说明'],
    type: 'single'
  },
  {
    id: 'q10',
    question: '您目前正在服用药物吗？',
    options: ['没有', '有，请在备注中说明'],
    type: 'single'
  }
]

export default function QuestionnairePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [progress, setProgress] = useState(0)

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length

  const handleOptionClick = (option: string) => {
    if (currentQuestion.type === 'single') {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }))
    } else {
      const currentValue = (answers[currentQuestion.id] as string[]) || []
      if (currentValue.includes(option)) {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: currentValue.filter(o => o !== option) }))
      } else {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: [...currentValue, option] }))
      }
    }
  }

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      Taro.showToast({ title: '请选择答案', icon: 'none' })
      return
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    Taro.showLoading({ title: '正在分析...' })
    setTimeout(() => {
      Taro.hideLoading()
      Taro.setStorageSync('healthAnswers', answers)
      Taro.navigateTo({ url: '/pages/tongue-diagnosis/index' })
    }, 2000)
  }

  const isOptionSelected = (option: string) => {
    if (currentQuestion.type === 'single') {
      return answers[currentQuestion.id] === option
    }
    return (answers[currentQuestion.id] as string[])?.includes(option)
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>健康基础问卷</Text>
        <Text className={styles.headerDesc}>回答以下问题，帮助我们更好地了解您的健康状况</Text>
      </View>

      <View className={styles.progressBar}>
        <View className={styles.progressFill} style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
      </View>
      <Text className={styles.progressText}>{answeredCount}/{questions.length}</Text>

      <ScrollView className={styles.content} scrollY>
        <View className={styles.questionCard}>
          <Text className={styles.questionNumber}>第 {currentIndex + 1} 题</Text>
          <Text className={styles.questionText}>{currentQuestion.question}</Text>
          
          <View className={styles.optionsList}>
            {currentQuestion.options.map((option, index) => (
              <View 
                key={index}
                className={`${styles.optionItem} ${isOptionSelected(option) ? styles.selected : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                <View className={`${styles.optionRadio} ${isOptionSelected(option) ? styles.selected : ''}`}>
                  {isOptionSelected(option) && <Text className={styles.radioInner}>✓</Text>}
                </View>
                <Text className={styles.optionText}>{option}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <View 
          className={`${styles.footerButton} ${styles.footerButtonOutline} ${currentIndex === 0 ? styles.disabled : ''}`}
          onClick={handlePrev}
        >
          <Text>上一题</Text>
        </View>
        <View className={styles.footerButton} onClick={handleNext}>
          <Text>{currentIndex === questions.length - 1 ? '提交' : '下一题'}</Text>
        </View>
      </View>

      <View className={styles.disclaimer}>
        <Text>⚠️ 本问卷结果仅作健康评估参考，不能替代专业医疗诊断</Text>
      </View>
    </View>
  )
}