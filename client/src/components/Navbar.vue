<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="brand" @click="$emit('home')">
        <div class="brand-logo">評</div>
        <div class="brand-text">
          <h1>修課評價系統</h1>
          <p>Rate My Course</p>
        </div>
      </div>
      <div class="nav-actions">
        <button class="add-btn" @click="$emit('add-course')">＋ 新增課程</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineEmits(['home', 'add-course']);
</script>

<style scoped>
.navbar {
  height: 72px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eef2ff;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.nav-container {
  width: 100%;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.brand-logo {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  color: white;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: bold;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.brand-text h1 {
  margin: 0;
  font-size: 18px;
  color: #1e3a8a;
  letter-spacing: 0.5px;
}

.brand-text p {
  margin: 0;
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
}

.add-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 99px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}
</style>
