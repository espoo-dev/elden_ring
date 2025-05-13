<template>
  <div class="current-step">
    <h3>Current Step: {{ step.title }}</h3>
    <div v-html="step.description"></div>
    <button
      @click="$emit('complete')"
      :disabled="step.completed"
      class="complete-btn"
    >
      {{ step.completed ? 'Completed' : 'Mark as Complete' }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'CurrentStep',
  props: {
    step: {
      type: Object,
      required: true
    }
  },
  emits: ['complete']
}
</script>

<style scoped>
.current-step {
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.complete-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.complete-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.complete-btn:hover:not(:disabled) {
  background-color: #45a049;
}
</style>