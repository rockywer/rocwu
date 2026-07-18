import React from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { mockRecipes } from '@/data/mock'
import styles from './index.module.scss'

export default function RecipeDetailPage() {
  const recipe = mockRecipes[0]
  
  const handleBuy = () => {
    Taro.showToast({ title: '已加入购物车', icon: 'success' })
  }

  const handleShare = () => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <Image className={styles.recipeImage} src={recipe.image} mode="aspectFill" />
      
      <View className={styles.content}>
        <View className={styles.recipeHeader}>
          <Text className={styles.recipeName}>{recipe.name}</Text>
          <View className={styles.recipeTags}>
            {recipe.tags.map((tag, index) => (
              <Text key={index} className={styles.recipeTag}>{tag}</Text>
            ))}
          </View>
          <Text className={styles.recipeDesc}>{recipe.description}</Text>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>🥬 食材清单</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} className={styles.ingredientItem}>
              <Text className={styles.ingredientName}>{ingredient.name}</Text>
              <Text className={styles.ingredientAmount}>{ingredient.amount}{ingredient.unit}</Text>
            </View>
          ))}
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>👩🍳 烹饪步骤</Text>
          {recipe.steps.map((step, index) => (
            <View key={index} className={styles.stepItem}>
              <Text className={styles.stepNumber}>{index + 1}</Text>
              <Text className={styles.stepContent}>{step}</Text>
            </View>
          ))}
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>📊 营养信息</Text>
          <View className={styles.nutritionGrid}>
            <View className={styles.nutritionItem}>
              <Text className={styles.nutritionValue}>{recipe.nutrition.protein}</Text>
              <Text className={styles.nutritionLabel}>蛋白质</Text>
            </View>
            <View className={styles.nutritionItem}>
              <Text className={styles.nutritionValue}>{recipe.nutrition.fat}</Text>
              <Text className={styles.nutritionLabel}>脂肪</Text>
            </View>
            <View className={styles.nutritionItem}>
              <Text className={styles.nutritionValue}>{recipe.nutrition.carbs}</Text>
              <Text className={styles.nutritionLabel}>碳水</Text>
            </View>
            <View className={styles.nutritionItem}>
              <Text className={styles.nutritionValue}>{recipe.nutrition.fiber}</Text>
              <Text className={styles.nutritionLabel}>膳食纤维</Text>
            </View>
          </View>
        </View>

        <View className={styles.divider} />
      </View>

      <View className={styles.bottomBar}>
        <View className={`${styles.bottomButton} ${styles.bottomButtonOutline}`} onClick={handleShare}>
          <Text>分享</Text>
        </View>
        <View className={styles.bottomButton} onClick={handleBuy}>
          <Text>一键购菜</Text>
        </View>
      </View>
    </ScrollView>
  )
}
