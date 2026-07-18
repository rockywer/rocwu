export interface UserProfile {
  id: string
  name: string
  avatar: string
  age: number
  height: number
  weight: number
  gender: 'male' | 'female'
  phone: string
  email: string
  memberLevel: 'free' | 'monthly' | 'yearly'
  expireDate?: string
}

export interface HealthRecord {
  id: string
  type: 'bloodPressure' | 'bloodGlucose' | 'bloodLipid' | 'weight' | 'sleep'
  value: number
  unit: string
  date: string
  status: 'normal' | 'warning' | 'danger'
}

export interface PhysicalExam {
  id: string
  date: string
  reportUrl: string
  summary: string
  items: ExamItem[]
}

export interface ExamItem {
  name: string
  value: string
  reference: string
  status: 'normal' | 'abnormal'
}

export interface BodyConstitution {
  type: '平和质' | '气虚质' | '阳虚质' | '阴虚质' | '痰湿质' | '湿热质' | '血瘀质' | '气郁质' | '特禀质'
  score: number
  date: string
  description: string
  suggestions: string[]
}

export interface Recipe {
  id: string
  name: string
  category: string
  image: string
  description: string
  ingredients: Ingredient[]
  steps: string[]
  nutrition: NutritionInfo
  tags: string[]
  suitableConstitution: string[]
  calories: number
}

export interface Ingredient {
  name: string
  amount: string
  unit: string
  type: 'major' | 'minor' | 'spice'
}

export interface NutritionInfo {
  protein: string
  fat: string
  carbs: string
  fiber: string
}

export interface MealPlan {
  id: string
  date: string
  breakfast: Recipe[]
  lunch: Recipe[]
  dinner: Recipe[]
  snack: Recipe[]
  tea: Recipe[]
}

export interface ChronicCondition {
  type: 'hypertension' | 'diabetes' | 'hyperlipidemia' | 'gout' | 'obesity'
  status: 'controlled' | 'uncontrolled'
  lastCheckDate: string
  nextCheckDate: string
  target: string
  current: string
}

export interface CheckInRecord {
  date: string
  diet: boolean
  exercise: boolean
  sleep: boolean
  medication: boolean
  notes?: string
}

export interface HealthReport {
  id: string
  period: '7days' | '30days'
  startDate: string
  endDate: string
  summary: string
  indicators: ReportIndicator[]
  improvement: number
  suggestions: string[]
  score: number
}

export interface ReportIndicator {
  name: string
  trend: 'up' | 'down' | 'stable'
  avgValue: string
  change: string
}

export interface ChatMessage {
  id: string
  type: 'user' | 'system'
  content: string
  timestamp: string
}

export interface QuestionnaireAnswer {
  questionId: string
  answer: string | number
}

export interface TongueAnalysis {
  color: string
  coating: string
  shape: string
  cracks: boolean
  teethMarks: boolean
  suggestions: string[]
}

export interface ReplacementIngredient {
  original: string
  replacement: string
  reason: string
}
