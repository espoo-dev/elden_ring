import { createStore } from 'vuex'
import { progressionService } from '../services/progressionService'

export default createStore({
  state: {
    currentRegionId: 'west-limgrave',
    regions: [],
    currentStepId: 1
  },
  mutations: {
    setRegions(state, regions) {
      state.regions = regions
    },
    setCurrentRegionId(state, regionId) {
      state.currentRegionId = regionId
    },
    setCurrentStepId(state, stepId) {
      state.currentStepId = stepId
    },
    completeStep(state, { regionId, stepId }) {
      const region = state.regions.find(r => r.id === regionId)
      if (region) {
        const step = region.steps.find(s => s.id === stepId)
        if (step) {
          step.completed = true
          // Set the next step as current
          const nextStep = region.steps.find(s => s.id === stepId + 1)
          if (nextStep) {
            state.currentStepId = nextStep.id
          }
        }
      }
    }
  },
  actions: {
    loadRegions({ commit }) {
      const regions = progressionService.getRegions()
      commit('setRegions', regions)
    },
    completeStep({ commit, state }, stepId) {
      commit('completeStep', { regionId: state.currentRegionId, stepId })
    }
  },
  getters: {
    currentRegion: state => {
      return progressionService.getRegionById(state.currentRegionId)
    },
    currentStep: state => {
      const region = progressionService.getRegionById(state.currentRegionId)
      if (!region) return null
      return region.steps.find(step => step.id === state.currentStepId)
    },
    nextStep: state => {
      const region = progressionService.getRegionById(state.currentRegionId)
      if (!region) return null
      return region.steps.find(step => step.id === state.currentStepId + 1)
    },
    progress: state => {
      return progressionService.getProgress(state.currentRegionId)
    }
  }
})