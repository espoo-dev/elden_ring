<template>
  <div class="region-info">
    <h2>{{ region?.name }}</h2>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
    <p>Progress: {{ Math.round(progress) }}%</p>
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
</style>