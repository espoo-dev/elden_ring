<template>
  <div class="progression-tracker">
    <button @click="clearStorage" class="clear-storage-button" title="Clear All Data">
      🗑️
    </button>

    <div class="regions-navigation">
      <button
        v-for="region in regions"
        :key="region.id"
        @click="switchToRegion(region.id)"
        class="region-btn"
        :class="{ active: region.id === currentRegionId }"
      >
        {{ region.name }}
      </button>
    </div>

    <div class="region-info">
      <h2>{{ currentRegion?.name }}</h2>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      <p>Progress: {{ Math.round(progress) }}%</p>
    </div>

    <div class="current-step" v-if="currentStep">
      <h3>Current Step: {{ currentStep.title }}</h3>
      <div v-html="currentStep.description"></div>
      <button
        @click="completeCurrentStep"
        :disabled="currentStep.completed"
        class="complete-btn"
      >
        {{ currentStep.completed ? 'Completed' : 'Mark as Complete' }}
      </button>
    </div>


    <div class="steps-list">
      <h3>All Steps</h3>
      <div
        v-for="step in currentRegion?.steps"
        :key="step.id"
        class="step-item"
        :class="{
          completed: step.completed,
          'current-step-item': step.id === currentStep?.id
        }"
        @click="selectStep(step.id)"
      >
        <span class="step-number">{{ step.id }}</span>
        <span class="step-title">{{ step.title }}</span>
        <span class="step-status">{{ step.completed ? '✓' : '○' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'ProgressionTracker',
  computed: {
    ...mapState(['currentRegionId', 'currentStepId', 'regions']),
    ...mapGetters(['currentRegion', 'currentStep', 'nextStep', 'progress', 'nextRegion', 'previousRegion'])
  },
  methods: {
    ...mapActions(['completeStep', 'loadRegions', 'switchToNextRegion', 'switchToPreviousRegion']),
    ...mapMutations(['setCurrentStepId', 'setCurrentRegionId']),
    switchToRegion(regionId) {
      this.setCurrentRegionId(regionId)
    },
    async completeCurrentStep() {
      if (this.currentStep && !this.currentStep.completed) {
        try {
          await this.completeStep(this.currentStep.id)
        } catch (error) {
          console.error('Error completing step:', error)
        }
      }
    },
    selectStep(stepId) {
      this.setCurrentStepId(stepId)
    },
    resetProgress() {
      // Implementation of resetProgress method
    },
    clearStorage() {
      if (confirm('Are you sure you want to clear all saved progress? This cannot be undone.')) {
        this.$store.dispatch('clearStorage')
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
  position: relative;
}

.clear-storage-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc3545;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.clear-storage-button:hover {
  background-color: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.clear-storage-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.regions-navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.region-btn {
  background-color: #fff;
  border: 2px solid #4CAF50;
  color: #4CAF50;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.region-btn:hover {
  background-color: #4CAF50;
  color: white;
}

.region-btn.active {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
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

.step-description {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.reset-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.reset-button:hover {
  background-color: #45a049;
}

.region-navigation {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
}

.region-nav-btn {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.region-nav-btn:hover {
  background-color: #1976D2;
  transform: translateY(-1px);
}

.region-nav-btn:active {
  background-color: #1565C0;
  transform: translateY(0);
}

.prev-region-btn {
  background-color: #607D8B;
}

.prev-region-btn:hover {
  background-color: #455A64;
}

.prev-region-btn:active {
  background-color: #37474F;
}
</style>