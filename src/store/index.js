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
    }
  },
  actions: {
    loadRegions({ commit }) {
      const regions = progressionService.getRegions()
      commit('setRegions', regions)
    },
    completeStep({ state }, stepId) {
      return progressionService.completeStep(state.currentRegionId, stepId)
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