import dayjs from 'dayjs';

const initialState = {
  value: {
    modal: {
      loading: false,
      error: false,
      success: false,
      errorTitle: '',
      errorMessage: '',
      successTitle: '',
      successMessage: '',
      isOpen: false,
    },
    siteCondition: {
      state: '',
      stateId: '',
      county: '',
      countyId: '',
      soilDrainage: '',
      plannedPlantingDate: dayjs(new Date()).format('MM/DD/YYYY'),
      acres: '',
      checkNRCSStandards: false,
      locationSelected: false,
      latitude: 37.75,
      longitude: -80.16,
      stateSelected: {},
      markers: null,
      locationStep: 1,
      zipCode: 0,
      zone: '',
      council: '',
    },
    speciesSelection: {
      queryString: '',
      selectedSpecies: '',
      queryResults: [],
      diversitySelected: [],
      seedsSelected: [],
    },
    mixRatios: {
      poundsOfSeed: 0,
      plantsPerAcre: 0,
    },
    NRCS: {
      enabled: false,
      results: {
        seedingRate: {
          value: true,
          seeds: [],
        },
        plantingDate: {
          value: true,
          seeds: [],
        },
        ratio: {
          value: true,
          seeds: [],
        },
        soilDrainage: {
          value: true,
          seeds: [],
        },
        expectedWinterSurvival: {
          value: 0,
          seeds: [],
        },
      },
    },
    mixSeedingRate: {},
    seedTagInfo: {},
    seedingMethod: {
      managementImpactOnMix: 0.5,
      min: 0,
      max: 0,
      seedingRateAverage: 0,
      seedingRateCoefficient: 0,
      type: 'Drilled',
    },
    reviewMix: {},
    confirmPlan: {},
    states: [],
    counties: [],
    crops: [],
  },
  etc: {},
};

export default initialState;
