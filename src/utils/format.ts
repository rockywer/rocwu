import dayjs from 'dayjs'
import type { HealthRecord } from '@/types'

export const formatDate = (dateStr: string, format: string = 'YYYY-MM-DD') => {
  return dayjs(dateStr).format(format)
}

export const formatTime = (dateStr: string) => {
  return dayjs(dateStr).format('HH:mm')
}

export const formatDateTime = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
}

export const getRelativeTime = (dateStr: string) => {
  const now = dayjs()
  const date = dayjs(dateStr)
  const diff = now.diff(date, 'day')
  
  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff === 2) return '前天'
  if (diff < 7) return `${diff}天前`
  if (diff < 30) return `${Math.floor(diff / 7)}周前`
  return formatDate(dateStr)
}

export const getAge = (birthDate: string) => {
  return dayjs().diff(dayjs(birthDate), 'year')
}

export const getStatusColor = (status: HealthRecord['status']) => {
  switch (status) {
    case 'normal':
      return '#00B42A'
    case 'warning':
      return '#FF7D00'
    case 'danger':
      return '#F53F3F'
    default:
      return '#86909C'
  }
}

export const getStatusText = (status: HealthRecord['status']) => {
  switch (status) {
    case 'normal':
      return '正常'
    case 'warning':
      return '偏高'
    case 'danger':
      return '异常'
    default:
      return '未知'
  }
}

export const getRecordTypeName = (type: HealthRecord['type']) => {
  const map: Record<HealthRecord['type'], string> = {
    bloodPressure: '血压',
    bloodGlucose: '血糖',
    bloodLipid: '血脂',
    weight: '体重',
    sleep: '睡眠'
  }
  return map[type] || type
}

export const getBMI = (weight: number, height: number) => {
  const h = height / 100
  return (weight / (h * h)).toFixed(1)
}

export const getBMICategory = (bmi: string) => {
  const value = parseFloat(bmi)
  if (value < 18.5) return { text: '偏瘦', color: '#1677FF' }
  if (value < 24) return { text: '正常', color: '#00B42A' }
  if (value < 28) return { text: '超重', color: '#FF7D00' }
  return { text: '肥胖', color: '#F53F3F' }
}

export const calculateCalories = (weight: number, height: number, age: number, gender: 'male' | 'female') => {
  const base = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161
  return Math.round(base)
}
