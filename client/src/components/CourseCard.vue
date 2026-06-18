<template>
  <div class="course-card" @click="$emit('click')">
    <div class="card-header">
      <div class="category-tag" :class="course.category">{{ course.category }}</div>
      <div class="rating-badge">
        <span class="star">★</span>
        <span class="score">{{ course.avg_rating || 'N/A' }}</span>
      </div>
    </div>
    
    <div class="card-body">
      <h3 class="course-name">{{ course.name }}</h3>
      <p class="teacher-name">{{ course.teacher }}</p>
      <p class="course-desc">{{ course.description }}</p>
    </div>

    <div class="card-footer">
      <div class="stats">
        <span class="stat-item" title="學分">
          <i class="icon">📘</i> {{ course.credit }} 學分
        </span>
        <span class="stat-item" title="評價數">
          <i class="icon">💬</i> {{ course.review_count }} 評價
        </span>
      </div>
      <div class="score-bars">
        <div class="bar-row">
          <label>作業</label>
          <div class="bar-bg"><div class="bar-fill" :style="{ width: (course.avg_workload * 20) + '%' }"></div></div>
        </div>
        <div class="bar-row">
          <label>通過率</label>
          <div class="bar-bg secondary"><div class="bar-fill" :style="{ width: (course.avg_difficulty * 20) + '%' }"></div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['course']);
defineEmits(['click']);
</script>

<style scoped>
.course-card {
  background: white;
  border: 1px solid #eef2ff;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #dbeafe;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-tag {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 99px;
  text-transform: uppercase;
}

.category-tag.必修 { background: #fee2e2; color: #dc2626; }
.category-tag.選修 { background: #e0f2fe; color: #0284c7; }
.category-tag.通識 { background: #f0fdf4; color: #16a34a; }

.rating-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fffbeb;
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid #fde68a;
}

.rating-badge .star { color: #f59e0b; font-size: 14px; }
.rating-badge .score { font-weight: 700; color: #b45309; font-size: 13px; }

.course-name {
  margin: 0 0 4px;
  font-size: 20px;
  color: #0f172a;
}

.teacher-name {
  margin: 0 0 12px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.course-desc {
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 20px;
}

.card-footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.score-bars {
  flex: 0 0 100px;
}

.bar-row {
  margin-bottom: 8px;
}

.bar-row:last-child { margin-bottom: 0; }

.bar-row label {
  display: block;
  font-size: 10px;
  color: #94a3b8;
  margin-bottom: 2px;
}

.bar-bg {
  height: 4px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 99px;
}

.bar-bg.secondary .bar-fill {
  background: #ef4444;
}
</style>
