<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>✨ 新增課程卡片</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      
      <div class="form">
        <div class="form-row">
          <div class="form-group">
            <label>課程名稱</label>
            <input v-model="form.name" class="form-input" placeholder="例如：資料結構">
          </div>
          <div class="form-group">
            <label>授課老師</label>
            <input v-model="form.teacher" class="form-input" placeholder="例如：王小明">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>類別</label>
            <select v-model="form.category" class="form-select">
              <option value="必修">必修</option>
              <option value="選修">選修</option>
              <option value="通識">通識</option>
            </select>
          </div>
          <div class="form-group">
            <label>學分數</label>
            <input type="number" v-model.number="form.credit" class="form-input" min="1" max="10">
          </div>
        </div>

        <div class="form-group">
          <label>開課系所</label>
          <input v-model="form.department" class="form-input" placeholder="例如：資訊工程學系">
        </div>

        <div class="form-group">
          <label>課程簡介</label>
          <textarea v-model="form.description" class="form-textarea" placeholder="簡短描述這門課程的內容..."></textarea>
        </div>

        <button class="submit-btn" :disabled="loading" @click="submit">
          {{ loading ? '處理中...' : '確認新增' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['close', 'refresh']);
const loading = ref(false);

const form = ref({
  name: '',
  teacher: '',
  category: '必修',
  credit: 3,
  department: '',
  description: ''
});

const API_BASE = import.meta.env.DEV ? "http://localhost:3000" : "";

async function submit() {
  if (!form.value.name || !form.value.teacher) {
    alert('請填寫完整資訊');
    return;
  }
  
  loading.value = true;
  try {
    await axios.post(`${API_BASE}/api/courses`, form.value);
    emit('refresh');
    emit('close');
  } catch (err) {
    alert('新增失敗：' + err.message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
textarea, input, select {
  color: #0f172a !important;
  background-color: #ffffff !important;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 200;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 201;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1e293b;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  color: #64748b;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

input, select, textarea {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  font-size: 14px;
  background: #ffffff !important;
  color: #0f172a !important;
  position: relative;
  z-index: 210;
  pointer-events: auto !important;
}

input:focus, select:focus, textarea:focus {
  border-color: #3b82f6;
  background: white;
}

textarea {
  height: 100px;
  resize: none;
}

.submit-btn {
  margin-top: 12px;
  background: #2563eb;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
