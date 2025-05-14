<template>
  <div class="region-info">
    <h2>{{ region?.name }}</h2>
    <div class="region-details">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="region-stats">
        <p>Progress: {{ Math.round(progress) }}%</p>
        <p class="suggested-level">Suggested Level: {{ region?.suggestedLevel }}</p>
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

.progress-bar {
  background-color: #eee;
  height: 20px;
  border-radius: 10px;
  margin: 1rem 0;
  overflow: hidden;
}

.progress {
  background-color: #4CAF50;
  height: 100%;
  transition: width 0.3s ease;
}

.region-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.suggested-level {
  color: #666;
  font-weight: 500;
}
</style>