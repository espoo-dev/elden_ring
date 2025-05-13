import regionsData from '../data/regions.json'

export const progressionService = {
  getRegions() {
    return regionsData.regions
  },

  getRegionById(regionId) {
    return regionsData.regions.find(region => region.id === regionId)
  },

  getCurrentStep(regionId) {
    const region = this.getRegionById(regionId)
    if (!region) return null
    return region.steps.find(step => !step.completed) || region.steps[0]
  },

  getNextStep(regionId, currentStepId) {
    const region = this.getRegionById(regionId)
    if (!region) return null
    return region.steps.find(step => step.id === currentStepId + 1)
  },

  completeStep(regionId, stepId) {
    const region = this.getRegionById(regionId)
    if (!region) return false

    const step = region.steps.find(s => s.id === stepId)
    if (step) {
      step.completed = true
      return true
    }
    return false
  },

  getProgress(regionId) {
    const region = this.getRegionById(regionId)
    if (!region) return 0

    const completed = region.steps.filter(step => step.completed).length
    return (completed / region.steps.length) * 100
  }
}