<template>
  <div class="progression-tracker">
    <ClearStorageButton @clear="clearStorage" />

    <RegionsNavigation
      :regions="regions"
      :current-region-id="currentRegionId"
      @select-region="switchToRegion"
    />

    <RegionInfo
      :region="currentRegion"
      :progress="progress"
    />

    <CurrentStep
      v-if="currentStep"
      :step="currentStep"
      @complete="completeCurrentStep"
    />

    <StepsList
      :steps="currentRegion?.steps"
      :current-step-id="currentStepId"
      @select-step="selectStep"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import ClearStorageButton from '@/components/progression/ClearStorageButton.vue'
import RegionsNavigation from '@/components/progression/RegionsNavigation.vue'
import RegionInfo from '@/components/progression/RegionInfo.vue'
import CurrentStep from '@/components/progression/CurrentStep.vue'
import StepsList from '@/components/progression/StepsList.vue'

export default {
  name: 'ProgressionTracker',
  components: {
    ClearStorageButton,
    RegionsNavigation,
    RegionInfo,
    CurrentStep,
    StepsList
  },
  setup() {
    const store = useStore()

    const regions = computed(() => store.state.region.regions)
    const currentRegionId = computed(() => store.state.region.currentRegionId)
    const currentStepId = computed(() => store.state.region.currentStepId)
    const currentRegion = computed(() => store.getters['region/currentRegion'])
    const currentStep = computed(() => store.getters['region/currentStep'])
    const progress = computed(() => store.getters['region/progress'])

    const switchToRegion = (regionId) => {
      store.commit('region/setCurrentRegionId', regionId)
    }

    const completeCurrentStep = async () => {
      if (currentStep.value && !currentStep.value.completed) {
        try {
          await store.dispatch('region/completeStep', currentStep.value.id)
        } catch (error) {
          console.error('Error completing step:', error)
        }
      }
    }

    const selectStep = (stepId) => {
      store.commit('region/setCurrentStepId', stepId)
    }

    const clearStorage = () => {
      if (confirm('Are you sure you want to clear all saved progress? This cannot be undone.')) {
        store.dispatch('region/clearStorage')
      }
    }

    // Load regions on component creation
    store.dispatch('region/loadRegions')

    return {
      regions,
      currentRegionId,
      currentStepId,
      currentRegion,
      currentStep,
      progress,
      switchToRegion,
      completeCurrentStep,
      selectStep,
      clearStorage
    }
  }
}
</script>

<style scoped>
.progression-tracker {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}
</style>