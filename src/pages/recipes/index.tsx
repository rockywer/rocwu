import React, { useState } from 'react'
import { View, Text, ScrollView, Input, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { mockRecipes } from '@/data/mock'
import styles from './index.module.scss'

export default function RecipesPage() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [searchValue, setSearchValue] = useState('')

  const categories = ['全部', '祛湿健脾', '补气养阴', '补气养血', '术后康复', '清热降火', '四季养生']

  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchCategory = activeCategory === '全部' || recipe.category === activeCategory
    const matchSearch = searchValue === '' || recipe.name.includes(searchValue) || recipe.description.includes(searchValue)
    return matchCategory && matchSearch
  })

  const handleRecipeClick = (recipeId: string) => {
    Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${recipeId}` })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>食养方案</Text>
        <Text className={styles.headerDesc}>根据体质和健康状况，定制专属膳食调理方案</Text>
        
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input 
            className={styles.searchInput}
            value={searchValue}
            onChange={(e: any) => setSearchValue(e.detail.value)}
            placeholder="搜索食谱..."
          />
        </View>
      </View>

      <View className={styles.content}>
        <ScrollView className={styles.categoryTabs} scrollX>
          {categories.map(category => (
            <View 
              key={category} 
              className={`${styles.categoryTab} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              <Text>{category}</Text>
            </View>
          ))}
        </ScrollView>

        <Text className={styles.sectionTitle}>推荐食谱</Text>
        
        <View className={styles.recipeGrid}>
          {filteredRecipes.map(recipe => (
            <View key={recipe.id} className={styles.recipeCard} onClick={() => handleRecipeClick(recipe.id)}>
              <Image className={styles.recipeImage} src={recipe.image} mode="aspectFill" />
              <View className={styles.recipeInfo}>
                <Text className={styles.recipeName}>{recipe.name}</Text>
                <Text className={styles.recipeDesc}>{recipe.description}</Text>
                <View className={styles.recipeTags}>
                  {recipe.tags.slice(0, 2).map((tag, index) => (
                    <Text key={index} className={styles.recipeTag}>{tag}</Text>
                  ))}
                </View>
                <View className={styles.recipeFooter}>
                  <Text className={styles.recipeCalories}>🔥 {recipe.calories}千卡</Text>
                  <Text className={styles.recipeArrow}>→</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {filteredRecipes.length === 0 && (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="text-text-auxiliary">暂无相关食谱</Text>
          </View>
        )}

        <View className={styles.bannerCard}>
          <Text className={styles.bannerTitle}>📋 定制专属食谱</Text>
          <Text className={styles.bannerDesc}>根据您的体质和健康状况，AI为您生成个性化食养方案</Text>
          <View className={styles.bannerButton} onClick={() => Taro.switchTab({ url: '/pages/consultation/index' })}>
            立即定制
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
