<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const courses = ref([]);
const search = ref("");
const selectedCourse = ref(null);
const loading = ref(false);

const form = ref({
  rating: 5,
  difficulty: 3,
  workload: 3,
  comment: "",
});

async function loadCourses() {
  loading.value = true;
  const res = await axios.get("http://localhost:3000/api/courses", {
    params: { search: search.value },
  });
  courses.value = res.data;
  loading.value = false;
}

async function viewCourse(id) {
  const res = await axios.get(`http://localhost:3000/api/courses/${id}`);
  selectedCourse.value = res.data;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function submitReview() {
  if (!form.value.comment.trim()) {
    alert("請輸入修課心得");
    return;
  }

  await axios.post(
    `http://localhost:3000/api/courses/${selectedCourse.value.id}/reviews`,
    form.value
  );

  form.value = {
    rating: 5,
    difficulty: 3,
    workload: 3,
    comment: "",
  };

  await viewCourse(selectedCourse.value.id);
  await loadCourses();
}

function backHome() {
  selectedCourse.value = null;
  loadCourses();
}

function stars(score) {
  if (!score) return "尚無評價";
  return "★".repeat(Math.round(score)) + "☆".repeat(5 - Math.round(score));
}

onMounted(loadCourses);
</script>

<template>
  <div class="page">
    <nav class="navbar">
      <div class="logo">修課評價系統</div>
      <div class="nav-text">Course Review System</div>
    </nav>

    <main class="container">
      <section v-if="!selectedCourse" class="home">
        <div class="hero">
          <p class="tag">Course Review Platform</p>
          <h1>修課評價系統</h1>
          <p class="subtitle">
            查詢課程評價、瀏覽修課心得，幫助學生在選課前做出更適合的選擇。
          </p>

          <div class="search-box">
            <span>🔍</span>
            <input
              v-model="search"
              @input="loadCourses"
              placeholder="搜尋課程名稱或授課老師"
            />
          </div>
        </div>

        <div class="section-title">
          <h2>課程列表</h2>
          <p>共 {{ courses.length }} 門課程</p>
        </div>

        <p v-if="loading" class="empty">載入中...</p>

        <div v-else class="course-list">
          <div v-for="course in courses" :key="course.id" class="course-card">
            <div class="card-top">
              <div>
                <h3>{{ course.name }}</h3>
                <p class="teacher">授課老師：{{ course.teacher }}</p>
              </div>

              <div class="score-box">
                <span class="score">{{ course.avg_rating || "-" }}</span>
                <small>平均分數</small>
              </div>
            </div>

            <div class="meta">
              <span>{{ course.department }}</span>
              <span>{{ course.credit }} 學分</span>
            </div>

            <p class="description">
              {{ course.description }}
            </p>

            <div class="rating-line">
              <span class="stars">{{ stars(course.avg_rating) }}</span>
              <span>{{ course.review_count }} 則評價</span>
            </div>

            <button @click="viewCourse(course.id)">查看詳細</button>
          </div>
        </div>
      </section>

      <section v-else class="detail">
        <button class="back-btn" @click="backHome">← 回課程列表</button>

        <div class="detail-hero">
          <div>
            <p class="tag">Course Detail</p>
            <h1>{{ selectedCourse.name }}</h1>
            <p>
              {{ selectedCourse.department }} ・ {{ selectedCourse.credit }} 學分
            </p>
            <p>授課老師：{{ selectedCourse.teacher }}</p>
          </div>

          <div class="big-score">
            <strong>{{ selectedCourse.avg_rating || "-" }}</strong>
            <span>{{ stars(selectedCourse.avg_rating) }}</span>
            <small>{{ selectedCourse.review_count }} 則評價</small>
          </div>
        </div>

        <div class="detail-grid">
          <div class="left">
            <div class="panel">
              <h2>課程介紹</h2>
              <p>{{ selectedCourse.description }}</p>
            </div>

            <div class="panel">
              <h2>學生評價</h2>

              <div
                v-for="review in selectedCourse.reviews"
                :key="review.id"
                class="review-card"
              >
                <div class="review-head">
                  <span class="review-stars">{{ stars(review.rating) }}</span>
                  <small>{{ review.created_at }}</small>
                </div>

                <div class="review-tags">
                  <span>難度 {{ review.difficulty }} / 5</span>
                  <span>作業量 {{ review.workload }} / 5</span>
                </div>

                <p>{{ review.comment }}</p>
              </div>

              <p v-if="selectedCourse.reviews.length === 0" class="empty">
                目前尚無評價，成為第一個留下心得的人吧。
              </p>
            </div>
          </div>

          <div class="right">
            <div class="panel review-form">
              <h2>新增修課評價</h2>

              <label>整體評分</label>
              <select v-model="form.rating">
                <option value="5">5 分，非常推薦</option>
                <option value="4">4 分，推薦</option>
                <option value="3">3 分，普通</option>
                <option value="2">2 分，不太推薦</option>
                <option value="1">1 分，不推薦</option>
              </select>

              <label>課程難度</label>
              <select v-model="form.difficulty">
                <option value="1">1 很簡單</option>
                <option value="2">2 偏簡單</option>
                <option value="3">3 普通</option>
                <option value="4">4 偏難</option>
                <option value="5">5 很難</option>
              </select>

              <label>作業量</label>
              <select v-model="form.workload">
                <option value="1">1 很少</option>
                <option value="2">2 偏少</option>
                <option value="3">3 普通</option>
                <option value="4">4 偏多</option>
                <option value="5">5 很多</option>
              </select>

              <label>修課心得</label>
              <textarea
                v-model="form.comment"
                placeholder="例如：老師上課方式、考試難度、作業量、是否推薦..."
              ></textarea>

              <button class="submit-btn" @click="submitReview">
                送出評價
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, "Microsoft JhengHei", sans-serif;
  background: #f7f8fb;
  color: #1f2937;
}

.page {
  min-height: 100vh;
}

.navbar {
  height: 72px;
  padding: 0 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-size: 26px;
  font-weight: 800;
  color: #172554;
}

.nav-text {
  color: #6b7280;
}

.container {
  max-width: 1180px;
  margin: auto;
  padding: 48px 24px;
}

.hero {
  text-align: center;
  margin-bottom: 42px;
}

.tag {
  color: #2563eb;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
  font-size: 15px;
}
.hero h1 {
  font-size: 48px;
  margin: 8px 0 10px;
  color: #111827;
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 1.2;
}

.subtitle {
  color: #6b7280;
  font-size: 17px;
  margin-top: 8px;
  line-height: 1.8;
}
.search-box {
  max-width: 620px;
  margin: 32px auto 0;
  background: white;
  border: 1px solid #dbe1ea;
  border-radius: 18px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.search-box input {
  width: 100%;
  padding: 18px 12px;
  border: none;
  outline: none;
  font-size: 16px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 22px;
}

.section-title h2 {
  font-size: 30px;
  margin: 0;
}

.section-title p {
  color: #6b7280;
  margin: 0;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 26px;
}

.course-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.07);
  transition: 0.25s;
}

.course-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 45px rgba(15, 23, 42, 0.12);
}

.card-top {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.course-card h3 {
  font-size: 25px;
  margin: 0 0 8px;
  color: #111827;
}

.teacher {
  color: #4b5563;
  margin: 0;
}

.score-box {
  width: 82px;
  height: 82px;
  border-radius: 20px;
  background: #eff6ff;
  color: #1d4ed8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score {
  font-size: 28px;
  font-weight: 800;
}

.score-box small {
  font-size: 12px;
}

.meta {
  display: flex;
  gap: 10px;
  margin: 22px 0 14px;
  flex-wrap: wrap;
}

.meta span,
.review-tags span {
  background: #f1f5f9;
  color: #475569;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 14px;
}

.description {
  color: #6b7280;
  line-height: 1.7;
  min-height: 54px;
}

.rating-line {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  color: #6b7280;
}

.stars,
.review-stars {
  color: #f59e0b;
  font-weight: 700;
}

button {
  border: none;
  background: #172554;
  color: white;
  padding: 13px 20px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
}

button:hover {
  background: #1e3a8a;
}

.detail {
  max-width: 1100px;
  margin: auto;
}

.back-btn {
  margin-bottom: 24px;
  background: #334155;
}

.detail-hero {
  background: linear-gradient(135deg, #172554, #2563eb);
  color: white;
  border-radius: 30px;
  padding: 38px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  box-shadow: 0 20px 45px rgba(37, 99, 235, 0.22);
}

.detail-hero h1 {
  margin: 8px 0 16px;
  font-size: 42px;
}

.detail-hero .tag {
  color: #bfdbfe;
}

.big-score {
  background: white;
  color: #172554;
  width: 180px;
  height: 180px;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.big-score strong {
  font-size: 52px;
}

.big-score span {
  color: #f59e0b;
  margin: 8px 0;
}

.big-score small {
  color: #64748b;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 28px;
}

.panel {
  background: white;
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
}

.panel h2 {
  margin-top: 0;
  color: #111827;
}

.panel p {
  color: #4b5563;
  line-height: 1.8;
}

.review-card {
  border-top: 1px solid #e5e7eb;
  padding: 20px 0;
}

.review-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.review-head small {
  color: #9ca3af;
}

.review-tags {
  display: flex;
  gap: 10px;
  margin: 14px 0;
  flex-wrap: wrap;
}

.review-form label {
  display: block;
  margin: 16px 0 8px;
  font-weight: 700;
}

.review-form select,
.review-form textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  padding: 13px;
  font-size: 15px;
  outline: none;
}

.review-form textarea {
  height: 130px;
  resize: none;
}

.submit-btn {
  width: 100%;
  margin-top: 20px;
}

.empty {
  color: #6b7280;
  text-align: center;
}

@media (max-width: 900px) {
  .course-list,
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .big-score {
    margin-top: 24px;
  }

  .navbar {
    padding: 0 24px;
  }

  .hero h1 {
    font-size: 38px;
  }
}
</style>