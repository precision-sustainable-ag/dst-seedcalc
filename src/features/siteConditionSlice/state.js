import dayjs from 'dayjs';

const initialState = {
  state: '',
  stateId: '',
  county: '',
  countyId: '',
  soilDrainage: '',
  plannedPlantingDate: dayjs(new Date()).format('MM/DD/YYYY'),
  acres: '',
  checkNRCSStandards: false,
  council: '',
};

export default initialState;
