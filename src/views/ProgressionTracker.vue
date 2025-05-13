<template>
  <div class="progression-tracker">
    <div class="region-info">
      <h2>{{ currentRegion?.name }}</h2>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      <p>Progress: {{ Math.round(progress) }}%</p>
    </div>

    <div class="current-step" v-if="currentStep">
      <h3>Current Step: {{ currentStep.title }}</h3>
      <p>{{ currentStep.description }}</p>
      <button
        @click="completeCurrentStep"
        :disabled="currentStep.completed"
        class="complete-btn"
      >
        {{ currentStep.completed ? 'Completed' : 'Mark as Complete' }}
      </button>
    </div>

    <div class="next-step" v-if="nextStep">
      <h4>Next Step:</h4>
      <p>{{ nextStep.title }}</p>
    </div>

    <div class="steps-list">
      <h3>All Steps</h3>
      <div v-for="step in currentRegion?.steps" :key="step.id" class="step-item" :class="{ completed: step.completed }">
        <span class="step-number">{{ step.id }}</span>
        <span class="step-title">{{ step.title }}</span>
        <span class="step-status">{{ step.completed ? '✓' : '○' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProgressionTracker',
  computed: {
    ...mapState(['currentRegionId']),
    ...mapGetters(['currentRegion', 'currentStep', 'nextStep', 'progress'])
  },
  methods: {
    ...mapActions(['completeStep', 'loadRegions']),
    async completeCurrentStep() {
      if (this.currentStep && !this.currentStep.completed) {
        try {
          await this.completeStep(this.currentStep.id)
          // Force a re-render of the component
          this.$forceUpdate()
        } catch (error) {
          console.error('Error completing step:', error)
        }
      }
    }
  },
  created() {
    this.loadRegions()
  }
}
</script>

<style scoped>
.progression-tracker {
  max-width: 800px;
  margin: 0 auto;
}

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

.current-step {
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.next-step {
  background-color: #e8f5e9;
  padding: 1rem;
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

.steps-list {
  margin-top: 2rem;
}

.step-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.step-item:hover {
  background-color: #f5f5f5;
}

.step-item.completed {
  background-color: #f0f9f0;
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