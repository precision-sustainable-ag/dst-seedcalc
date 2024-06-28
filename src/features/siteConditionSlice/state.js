import dayjs from 'dayjs';

const initialState = {
  state: '',
  stateId: '',
  county: '',
  countyId: '',
  soilDrainage: '',
  prevSoilDrainage: '',
  tileDrainage: false,
  plantingDate: dayjs(new Date()).format('MM/DD/YYYY'),
  acres: 0,
  checkNRCSStandards: false,
  council: '',
  soilFertility: '',
  latlon: [],
  loading: false,
  error: false,
};

export default initialState;
