<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import Navbar from "./components/Navbar.vue";
import FilterBar from "./components/FilterBar.vue";
import CourseCard from "./components/CourseCard.vue";
import CourseModal from "./components/CourseModal.vue";
import CourseDetail from "./components/CourseDetail.vue";

const courses = ref([]);
const search = ref("");
const category = ref("");
const sort = ref("newest");
const selectedCourse = ref(null);
const showCourseModal = ref(false);
const loading = ref(false);

// 設定 API 基礎路徑
const API_BASE = import.meta.env.DEV ? "http://localhost:3000" : "";

async function loadCourses() {
  loading.value = true;
  try {
    const res = await axios.get(`${API_BASE}/api/courses`, {
      params: { 
        search: search.value,
        category: category.value,
        sort: sort.value
      },
    });
    courses.value = res.data;
  } catch (err) {
    console.error("Failed to load courses", err);
  } finally {
    loading.value = false;
  }
}

async function viewCourse(id) {
  try {
    const res = await axios.get(`${API_BASE}/api/courses/${id}`);
    selectedCourse.value = res.data;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    alert("載入課程失敗");
  }
}

function handleBack() {
  selectedCourse.value = null;
  loadCourses();
}

// 監聽篩選條件變化
watch([search, category, sort], () => {
  if (!selectedCourse.value) {
    loadCourses();
  }
});

onMounted(loadCourses);
</script>

<template>
  <div class="app-layout">
    <Navbar 
      @home="handleBack" 
      @add-course="showCourseModal = true" 
    />

    <template v-if="!selectedCourse">
      <FilterBar 
        v-model:search="search"
        v-model:category="category"
        v-model:sort="sort"
      />

      <main class="main-content">
        <div class="content-container">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>正在尋找好課...</p>
          </div>

          <div v-else-if="courses.length > 0" class="course-grid">
            <CourseCard 
              v-for="course in courses" 
              :key="course.id" 
              :course="course"
              @click="viewCourse(course.id)"
            />
          </div>

          <div v-else class="empty-state">
            <div class="empty-illustration">🔍</div>
            <h3>找不到相關課程！</h3>
            <p>試著調整關鍵字或篩選條件，或是自己新增一門課！</p>
            <button class="add-prompt-btn" @click="showCourseModal = true">＋ 新增一門課程</button>
          </div>
        </div>
      </main>
    </template>

    <CourseDetail 
      v-else 
      :course="selectedCourse" 
      @back="handleBack"
      @refresh="viewCourse"
    />

    <CourseModal 
      v-if="showCourseModal" 
      @close="showCourseModal = false" 
      @refresh="loadCourses"
    />
  </div>
</template>

<style>
:root {
  --primary: #2563eb;
  --bg-main: #f8fafc;
}

body {
  margin: 0;
  font-family: 'Inter', 'Noto Sans TC', sans-serif;
  background-color: var(--bg-main);
  color: #0f172a;
  -webkit-font-smoothing: antialiased;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 40px 0;
}

.content-container {
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-illustration {
  font-size: 64px;
  margin-bottom: 24px;
}

.empty-state h3 {
  color: #1e293b;
  margin: 0 0 12px;
}

.add-prompt-btn {
  margin-top: 24px;
  padding: 12px 24px;
  border-radius: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 640px) {
  .course-grid {
    grid-template-columns: 1fr;
  }
}
</style>
