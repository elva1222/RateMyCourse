<template>
  <div class="filter-bar">
    <div class="filter-container">
      <div class="search-section">
        <div class="search-input">
          <span class="icon">🔍</span>
          <input 
            type="text" 
            v-model="internalSearch"
            placeholder="搜尋課程名稱、教授姓名..."
          >
        </div>
      </div>

      <div class="categories">
        <button 
          v-for="cat in categories" 
          :key="cat.value"
          :class="['cat-btn', { active: category === cat.value }]"
          @click="$emit('update:category', cat.value)"
        >
          {{ cat.label }}
        </button>
      </div>

      <div class="sort-section">
        <select :value="sort" @change="$emit('update:sort', $event.target.value)">
          <option value="newest">最新發布</option>
          <option value="rating_desc">推薦度 (高→低)</option>
          <option value="workload_asc">作業量 (少→多)</option>
          <option value="difficulty_asc">通過率 (高→低)</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['search', 'category', 'sort']);
const emit = defineEmits(['update:search', 'update:category', 'update:sort']);

const internalSearch = computed({
  get: () => props.search,
  set: (val) => emit('update:search', val)
});

const categories = [
  { label: '全部課程', value: '' },
  { label: '必修', value: '必修' },
  { label: '選修', value: '選修' },
  { label: '通識', value: '通識' },
];
</script>

<style scoped>
.filter-bar {
  background: white;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
  position: sticky;
  top: 72px;
  z-index: 90;
}

.filter-container {
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.search-section {
  flex: 1;
  min-width: 300px;
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input .icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
}

.search-input input {
  width: 100%;
  padding: 12px 14px 12px 44px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  color: #0f172a;
  outline: none;
  transition: all 0.2s;
}

.search-input input:focus {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.categories {
  display: flex;
  gap: 8px;
}

.cat-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: #f1f5f9;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-btn:hover {
  background: #e2e8f0;
}

.cat-btn.active {
  background: #3b82f6;
  color: white;
}

.sort-section select {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  background: white;
  color: #475569;
  cursor: pointer;
}
</style>
