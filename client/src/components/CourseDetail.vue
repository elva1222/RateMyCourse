<template>
  <div class="detail-view">
    <div class="detail-container">
      <header class="header">
        <button class="back-link" @click="$emit('back')">← 課程列表</button>
        <div class="header-main">
          <h1>{{ course.name }}</h1>
          <div class="teacher-info">
            <span class="teacher-tag">授課教授</span>
            <span class="name">{{ course.teacher }}</span>
          </div>
        </div>
      </header>

      <div class="grid">
        <div class="main-col">
          <section class="info-card section">
            <h3>課程資訊</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>類型</label>
                <span class="value">{{ course.category }}</span>
              </div>
              <div class="info-item">
                <label>學分</label>
                <span class="value">{{ course.credit }}</span>
              </div>
              <div class="info-item">
                <label>開課單位</label>
                <span class="value">{{ course.department }}</span>
              </div>
            </div>
            <div class="course-description">
              <label>課程簡介</label>
              <p>{{ course.description || '暫無簡介' }}</p>
            </div>
          </section>

          <section class="reviews-section section">
            <div class="section-header">
              <h3>學生評價 ({{ course.reviews?.length || 0 }})</h3>
            </div>
            <div v-if="course.reviews?.length" class="review-list">
              <div v-for="review in course.reviews" :key="review.id" class="review-card">
                <div class="review-header">
                  <div class="meta">
                    <span class="stars">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</span>
                    <span class="date">{{ review.created_at?.split(' ')[0] }}</span>
                  </div>
                  <div class="metrics">
                    <span class="badge">作業量 {{ review.workload }}/5</span>
                    <span class="badge">通過率 {{ review.difficulty }}/5</span>
                    <span class="badge">考題難度 {{ review.exam }}/5</span>
                    <span class="badge">學習收穫 {{ review.gain }}/5</span>
                    <span class="badge">課程趣味 {{ review.fun }}/5</span>
                  </div>
                </div>
                <p class="comment">{{ review.comment }}</p>
              </div>
            </div>
            <div v-else class="empty-reviews">
              😴 目前尚無評價，快來成為第一個吧！
            </div>
          </section>
        </div>

        <aside class="side-col">
          <div class="stat-card section">
            <h3>綜合評分</h3>
            <div class="big-rating">
              <span class="num">{{ course.avg_rating || '?' }}</span>
              <span class="total">/ 5.0</span>
            </div>
            <div class="sub-metrics">
              <div class="metric-row">
                <label>作業壓力</label>
                <div class="bar-bg"><div class="bar-fill" :style="{ width: (course.avg_workload * 20) + '%' }"></div></div>
              </div>
              <div class="metric-row">
                <label>通過率</label>
                <div class="bar-bg"><div class="bar-fill warning" :style="{ width: (course.avg_difficulty * 20) + '%' }"></div></div>
              </div>
              <div class="metric-row">
                <label>學習收穫</label>
                <div class="bar-bg"><div class="bar-fill accent" :style="{ width: (course.avg_gain * 20) + '%' }"></div></div>
              </div>
              <div class="metric-row">
                <label>課程趣味</label>
                <div class="bar-bg"><div class="bar-fill info" :style="{ width: (course.avg_fun * 20) + '%' }"></div></div>
              </div>
            </div>
          </div>

          <div class="form-card section">
            <h3>我也要留言</h3>
            <p class="form-hint">註：1分代表最差/最痛苦，5分代表最好/最滿意</p>
            <div class="review-form">
              <div class="rating-input">
                <label>總體推薦度</label>
                <div class="star-picker">
                  <span 
                    v-for="i in 5" 
                    :key="i"
                    :class="{ active: reviewForm.rating >= i }"
                    @click="reviewForm.rating = i"
                  >★</span>
                </div>
              </div>
              
              <div class="form-grid">
                <div class="field">
                  <label>作業量</label>
                  <select v-model.number="reviewForm.workload">
                    <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
                  </select>
                </div>
                <div class="field">
                  <label>通過率</label>
                  <select v-model.number="reviewForm.difficulty">
                    <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
                  </select>
                </div>
              </div>

              <div class="form-grid">
                <div class="field">
                  <label>考題難度</label>
                  <select v-model.number="reviewForm.exam">
                    <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
                  </select>
                </div>
                <div class="field">
                  <label>學習收穫</label>
                  <select v-model.number="reviewForm.gain">
                    <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
                  </select>
                </div>
              </div>

              <div class="field">
                <label>課程趣味性</label>
                <select v-model.number="reviewForm.fun">
                  <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>

              <div class="field">
                <label>詳細修課心得</label>
                <textarea v-model="reviewForm.comment" placeholder="這門課的內容、期中期末考方式..."></textarea>
              </div>

              <button class="submit-btn" :disabled="submitting" @click="submitReview">
                {{ submitting ? '發布中...' : '提交評價' }}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps(['course']);
const emit = defineEmits(['back', 'refresh']);

const submitting = ref(false);
const reviewForm = ref({
  rating: 5,
  workload: 3,
  difficulty: 3,
  comment: '',
  exam: 3,
  gain: 5,
  fun: 5
});

async function submitReview() {
  if (!reviewForm.value.comment.trim()) {
    alert('評價內容不能為空');
    return;
  }
  
  submitting.value = true;
  try {
    await axios.post(`http://localhost:3000/api/courses/${props.course.id}/reviews`, reviewForm.value);
    emit('refresh', props.course.id);
    reviewForm.value.comment = '';
  } catch (err) {
    alert('提交失敗：' + err.message);
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
textarea, select {
  color: #0f172a !important;
  background-color: #ffffff !important;
}

.detail-view {
  background: #f8fafc;
  min-height: calc(100vh - 72px);
}

.detail-container {
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
}

.header {
  margin-bottom: 32px;
}

.back-link {
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
}

.header-main h1 {
  font-size: 40px;
  color: #0f172a;
  margin: 0 0 12px;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.teacher-tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.teacher-info .name {
  font-size: 18px;
  color: #475569;
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
}

.section {
  background: white;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}

.section h3 {
  margin: 0 0 24px;
  font-size: 18px;
  color: #1e293b;
}

.form-hint {
  font-size: 12px;
  color: #64748b;
  margin-top: -16px;
  margin-bottom: 24px;
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-block;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.info-item label {
  display: block;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.info-item .value {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.course-description p {
  color: #475569;
  line-height: 1.8;
  white-space: pre-wrap;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  padding: 24px;
  background: #f8fafc;
  border-radius: 16px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stars { color: #f59e0b; font-weight: 700; }
.date { color: #94a3b8; font-size: 12px; margin-left: 12px; }

.badges { display: flex; gap: 8px; }
.badge {
  background: white;
  color: #64748b;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  border: 1px solid #e2e8f0;
}

.comment {
  color: #334155;
  line-height: 1.6;
}

.big-rating {
  text-align: center;
  margin-bottom: 24px;
}

.big-rating .num { font-size: 64px; font-weight: 900; color: #1d4ed8; }
.big-rating .total { font-size: 20px; color: #94a3b8; font-weight: 700; }

.metric-row { margin-bottom: 16px; }
.metric-row label { display: block; font-size: 12px; color: #64748b; margin-bottom: 6px; }
.bar-bg { height: 8px; background: #f1f5f9; border-radius: 99px; }
.bar-fill { height: 100%; background: #3b82f6; border-radius: 99px; }
.bar-fill.accent { background: #10b981; }
.bar-fill.warning { background: #f59e0b; }
.bar-fill.info { background: #8b5cf6; }

.star-picker {
  display: flex;
  gap: 8px;
  font-size: 32px;
  color: #e2e8f0;
  cursor: pointer;
  margin-top: 8px;
}

.star-picker span.active { color: #f59e0b; }

.field { margin-top: 20px; }
.field label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 8px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; pointer-events: auto; }

select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #0f172a;
  outline: none;
  position: relative;
  z-index: 10;
  pointer-events: auto;
}

textarea { height: 120px; resize: none; }

.submit-btn {
  width: 100%;
  margin-top: 24px;
  background: #1d4ed8;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-weight: 800;
  cursor: pointer;
}

.empty-reviews {
  text-align: center;
  padding: 60px;
  color: #94a3b8;
  font-weight: 500;
}

@media (max-width: 1100px) {
  .grid { grid-template-columns: 1fr; }
  .side-col { order: -1; }
}
</style>
