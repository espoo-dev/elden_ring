import { createStore } from 'vuex'
import { progressionService } from '../services/progressionService'

export default createStore({
  state: {
    currentRegionId: 'west-limgrave',
    regions: []
  },
  mutations: {
    setRegions(state, regions) {
      state.regions = regions
    },
    setCurrentRegionId(state, regionId) {
      state.currentRegionId = regionId
    },
    completeStep(state, { regionId, stepId }) {
      const region = state.regions.find(r => r.id === regionId)
      if (region) {
        const step = region.steps.find(s => s.id === stepId)
        if (step) {
          step.completed = true
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
      return progressionService.getCurrentStep(state.currentRegionId)
    },
    nextStep: state => {
      const currentStep = progressionService.getCurrentStep(state.currentRegionId)
      return currentStep ? progressionService.getNextStep(state.currentRegionId, currentStep.id) : null
    },
    progress: state => {
      return progressionService.getProgress(state.currentRegionId)
    }
  }
})