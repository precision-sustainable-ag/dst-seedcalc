/*eslint-disable */
/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import { useState, useEffect, Fragment } from 'react';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

import { getLocality } from '../../features/stepSlice/api';
import {
  updateAllSteps,
  updateSteps,
  updateModal,
} from '../../features/stepSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [CSVImport, setCSVImport] = useState([]);
  const [council, setCouncil] = useState('');

  const data = useSelector((state) => state.steps.value);
  const { speciesSelection, siteCondition } = data;
  const [imgPath, setImgPath] = useState(
    siteCondition?.council === 'MCCC' ? './mccc-logo.png' : './neccc-logo.png',
  );
  const { seedsSelected } = speciesSelection;

  /// ///////////////////////////////////////////////////////
  //                      Redux                           //
  /// ///////////////////////////////////////////////////////

  const handleUpdateSteps = (key, type, val) => {
    dispatch(
      updateSteps({
        type,
        key,
        value: val,
      }),
    );
  };

  /// ///////////////////////////////////////////////////////
  //                      State Logic                     //
  /// ///////////////////////////////////////////////////////

  const handleModal = (type, title, description) => {
    let payload = {};
    if (type === 'error') {
      payload = {
        value: {
          loading: false,
          error: true,
          success: false,
          errorTitle: title,
          errorMessage: description,
          successTitle: '',
          successMessage: '',
          isOpen: true,
        },
      };
    } else {
      payload = {
        value: {
          loading: false,
          error: true,
          success: true,
          errorTitle: '',
          errorMessage: '',
          successTitle: title,
          successMessage: description,
          isOpen: true,
        },
      };
    }
    dispatch(updateModal(payload));
  };

  /// ///////////////////////////////////////////////////////
  //                  Import Logic                        //
  /// ///////////////////////////////////////////////////////

  const handleFileUpload = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const lastItem = results.data[results.data.length - 1];
        if (lastItem.label !== 'EXT-DATA-OBJECT') {
          handleModal(
            'error',
            'Invalid Format',
            'CSV format invalid. Please try again.',
          );
        } else {
          const extDataObject = JSON.parse(
            results.data[results.data.length - 1].extData,
          );
          setCSVImport(extDataObject);
        }
      },
    });
  };
  const handleImportCSV = () => {
    const type = CSVImport.siteCondition.county.includes('Zone')
      ? 'NECCC'
      : 'MCCC';
    dispatch(updateAllSteps({ value: CSVImport }));
    navigate('/calculator');
  };
  const setModal = () => {
    setOpenModal(!openModal);
  };
  const handleCouncil = (e) => {
    setCouncil(e.target.value);
    const imagePath = e.target.value === 'MCCC' ? './mccc-logo.png' : './neccc-logo.png';
    setImgPath(imagePath);
  };
  /// ///////////////////////////////////////////////////////
  //                     useEffect                        //
  /// ///////////////////////////////////////////////////////

  useEffect(() => {
    dispatch(getLocality()).then((res) => {
      navigate('/calculator');
    });
  }, []);

  /// ///////////////////////////////////////////////////////
  //                      Render                          //
  /// ///////////////////////////////////////////////////////

  const renderHome = () => <></>;

  return (
    <Grid container>
      {/* <Header
          className="header-container"
          headerVariant="dstHeaderHome"
          text="Seeding Rate Calculator"
          size={12}
          // style={{ mt: 5 }}
        /> */}

      {renderHome()}
    </Grid>
  );
};

export default Home;
