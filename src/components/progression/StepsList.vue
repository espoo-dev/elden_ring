<template>
  <div class="steps-list">
    <h3>All Steps</h3>
    <div
      v-for="step in steps"
      :key="step.id"
      class="step-item"
      :class="{
        completed: step.completed,
        'current-step-item': step.id === currentStepId
      }"
      @click="$emit('select-step', step.id)"
    >
      <span class="step-number">{{ step.id }}</span>
      <span class="step-title">{{ step.title }}</span>
      <span class="step-status">{{ step.completed ? '✓' : '○' }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepsList',
  props: {
    steps: {
      type: Array,
      required: true
    },
    currentStepId: {
      type: Number,
      required: true
    }
  },
  emits: ['select-step']
}
</script>

<style scoped>
.steps-list {
  margin-top: 2rem;
}

.step-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.step-item:hover {
  background-color: #f5f5f5;
}

.step-item.completed {
  background-color: #f0f9f0;
}

.step-item.current-step-item {
  background-color: #e3f2fd;
  border-left: 4px solid #2196F3;
}

.step-number {
  width: 30px;
  font-weight: bold;
  color: #666;
}

.step-title {
  flex: 1;
  margin: 0 1rem;
}

.step-status {
  color: #4CAF50;
  font-weight: bold;
}
</style>