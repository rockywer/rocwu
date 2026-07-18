import { disclaimers, riskLevels, specialGroupConstraints } from '@/config/agentPrompts'

export interface ComplianceResult {
  isCompliant: boolean
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  message: string
  recommendations: string[]
}

const emergencyKeywords = [
  '胸痛', '胸闷', '心悸', '心慌', '呼吸困难', '喘不上气',
  '持续眩晕', '头晕', '晕倒', '晕厥',
  '呕血', '便血', '黑便',
  '高烧', '发热', '体温',
  '麻木', '肢体麻木', '手脚麻木',
  '昏迷', '意识模糊', '失去意识',
  '剧烈疼痛', '剧痛',
  '呼吸困难', '窒息',
  '大量出血', '出血不止',
  '抽搐', '惊厥',
  '心跳加速', '心跳过快',
  '血压骤降', '血压升高',
  '视力模糊', '失明',
  '言语不清', '失语',
  '吞咽困难',
  '恶心', '呕吐',
  '腹泻', '腹痛'
]

const diagnosisKeywords = [
  '诊断', '确诊', '判定', '确定', '断定',
  '治疗', '治愈', '根治', '治好',
  '处方', '开药', '用药', '药方',
  '手术', '住院', '就诊',
  '病', '疾病', '病症', '症状',
  '癌症', '肿瘤', '癌',
  '心脏病', '心梗', '脑梗',
  '中风', '偏瘫',
  '糖尿病', '高血压', '高血脂',
  '痛风', '关节炎', '类风湿',
  '肺炎', '支气管炎', '哮喘',
  '肝炎', '肾炎', '肾病',
  '胃病', '胃溃疡', '胃炎',
  '贫血', '白血病',
  '癫痫', '帕金森', '老年痴呆',
  '抑郁症', '焦虑症', '精神病'
]

const absoluteKeywords = [
  '百分百', '100%', '绝对', '一定',
  '保证', '承诺', '确保',
  '特效', '神奇', '奇迹',
  '永不复发', '彻底治愈', '根除'
]

export function checkCompliance(input: string): ComplianceResult {
  const lowerInput = input.toLowerCase()

  const containsEmergency = emergencyKeywords.some(keyword => 
    lowerInput.includes(keyword.toLowerCase())
  )

  const containsDiagnosis = diagnosisKeywords.some(keyword => 
    lowerInput.includes(keyword.toLowerCase())
  )

  const containsAbsolute = absoluteKeywords.some(keyword => 
    lowerInput.includes(keyword.toLowerCase())
  )

  if (containsEmergency) {
    return {
      isCompliant: false,
      riskLevel: 'critical',
      message: disclaimers.highRisk,
      recommendations: ['立即停止使用本产品', '尽快拨打急救电话或前往医院', '不要自行处理']
    }
  }

  if (containsDiagnosis) {
    return {
      isCompliant: false,
      riskLevel: 'high',
      message: '您提到了疾病相关的问题，本产品不能替代专业医师诊断。',
      recommendations: ['建议前往医院就诊', '咨询专业医生', '不要依赖本产品获取医疗建议']
    }
  }

  if (containsAbsolute) {
    return {
      isCompliant: false,
      riskLevel: 'medium',
      message: '健康调理需要时间和耐心，不存在绝对有效的方案。',
      recommendations: ['保持理性期待', '遵循科学方法', '长期坚持健康生活方式']
    }
  }

  return {
    isCompliant: true,
    riskLevel: 'low',
    message: disclaimers.general,
    recommendations: []
  }
}

export function checkIngredientSafety(ingredient: string, userProfile: any): { safe: boolean; reason?: string } {
  if (!userProfile) return { safe: true }

  const constraints = Object.values(specialGroupConstraints)

  for (const constraint of constraints) {
    if (userProfile.specialGroups?.includes(constraint.name)) {
      if (constraint.forbiddenIngredients.some(
        forbidden => ingredient.includes(forbidden)
      )) {
        return {
          safe: false,
          reason: `${constraint.name}不宜食用${ingredient}`
        }
      }
    }
  }

  if (userProfile.pregnant) {
    if (specialGroupConstraints.pregnant.forbiddenIngredients.some(
      forbidden => ingredient.includes(forbidden)
    )) {
      return {
        safe: false,
        reason: '孕妇不宜食用'
      }
    }
  }

  if (userProfile.age < 3) {
    if (specialGroupConstraints.infant.forbiddenIngredients.some(
      forbidden => ingredient.includes(forbidden)
    )) {
      return {
        safe: false,
        reason: '婴幼儿不宜食用'
      }
    }
  }

  return { safe: true }
}

export function getRiskLevelByValue(type: string, value: number): 'low' | 'medium' | 'high' | 'critical' {
  const thresholds: Record<string, { normal: number; warning: number; danger: number }> = {
    bloodPressure: { normal: 130, warning: 140, danger: 160 },
    bloodGlucose: { normal: 6.1, warning: 7.0, danger: 11.1 },
    bloodLipid: { normal: 5.2, warning: 6.2, danger: 7.2 },
    uricAcid: { normal: 420, warning: 480, danger: 540 }
  }

  const threshold = thresholds[type]
  if (!threshold) return 'low'

  if (value >= threshold.danger) return 'critical'
  if (value >= threshold.warning) return 'high'
  if (value >= threshold.normal) return 'medium'
  return 'low'
}

export function getRiskLevelInfo(level: 'low' | 'medium' | 'high' | 'critical') {
  return riskLevels.find(r => r.level === level)
}

export function generateDisclaimer(level: 'low' | 'medium' | 'high' | 'critical'): string {
  if (level === 'high' || level === 'critical') {
    return disclaimers.highRisk
  }
  return disclaimers.general
}