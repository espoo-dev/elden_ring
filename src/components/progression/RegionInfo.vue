<template>
  <div class="region-info">
    <div class="region-details">
      <div class="region-header">
        <span class="progress-text">Progress: {{ Math.round(progress) }}%</span>
        <h2 class="region-title">{{ region?.name }}</h2>
        <span class="suggested-level">Suggested Level: {{ region?.suggestedLevel }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegionInfo',
  props: {
    region: {
      type: Object,
      required: true
    },
    progress: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.region-info {
  margin-bottom: 2rem;
}

.region-details {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
}

.region-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.region-title {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.progress-text {
  color: #4CAF50;
  font-weight: 500;
}

.suggested-level {
  color: #666;
  font-weight: 500;
  text-align: right;
}

.progress-bar {
  background-color: #eee;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  background-color: #4CAF50;
  height: 100%;
  transition: width 0.3s ease;
}
</style>