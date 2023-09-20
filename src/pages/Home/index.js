//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

import { getLocality } from "../../features/stepSlice/api";
import {
  updateAllSteps,
  updateSteps,
  updateModal,
} from "../../features/stepSlice";
import { DSTButton } from "./../../components/Button";
import { Header } from "./../../components/Header";
import { CSVModal } from "./CSVModal";
import { Dropdown } from "../../components/Dropdown";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [CSVImport, setCSVImport] = useState([]);
  const [council, setCouncil] = useState("");

  const data = useSelector((state) => state.steps.value);
  const { speciesSelection, siteCondition } = data;
  const [imgPath, setImgPath] = useState(
    siteCondition?.council === "MCCC" ? "./mccc-logo.png" : "./neccc-logo.png"
  );
  const seedsSelected = speciesSelection.seedsSelected;

  //////////////////////////////////////////////////////////
  //                      Redux                           //
  //////////////////////////////////////////////////////////

  const handleUpdateSteps = (key, type, val) => {
    dispatch(
      updateSteps({
        type: type,
        key: key,
        value: val,
      })
    );
  };

  //////////////////////////////////////////////////////////
  //                      State Logic                     //
  //////////////////////////////////////////////////////////

  const handleModal = (type, title, description) => {
    var payload = {};
    if (type === "error") {
      payload = {
        value: {
          loading: false,
          error: true,
          success: false,
          errorTitle: title,
          errorMessage: description,
          successTitle: "",
          successMessage: "",
          isOpen: true,
        },
      };
    } else {
      payload = {
        value: {
          loading: false,
          error: true,
          success: true,
          errorTitle: "",
          errorMessage: "",
          successTitle: title,
          successMessage: description,
          isOpen: true,
        },
      };
    }
    dispatch(updateModal(payload));
  };

  //////////////////////////////////////////////////////////
  //                  Import Logic                        //
  //////////////////////////////////////////////////////////

  const handleFileUpload = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const lastItem = results.data[results.data.length - 1];
        if (lastItem.label !== "EXT-DATA-OBJECT") {
          handleModal(
            "error",
            "Invalid Format",
            "CSV format invalid. Please try again."
          );
        } else {
          const extDataObject = JSON.parse(
            results.data[results.data.length - 1].extData
          );
          setCSVImport(extDataObject);
        }
      },
    });
  };
  const handleImportCSV = () => {
    const type = CSVImport.siteCondition.county.includes("Zone")
      ? "NECCC"
      : "MCCC";
    dispatch(updateAllSteps({ value: CSVImport }));
    navigate(`/calculator`);
  };
  const setModal = () => {
    setOpenModal(!openModal);
  };
  const handleCouncil = (e) => {
    setCouncil(e.target.value);
    const imagePath =
      e.target.value === "MCCC" ? "./mccc-logo.png" : "./neccc-logo.png";
    setImgPath(imagePath);
  };
  //////////////////////////////////////////////////////////
  //                     useEffect                        //
  //////////////////////////////////////////////////////////

  useEffect(() => {
    dispatch(getLocality());
  }, []);

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  const renderHome = () => {
    return (
      <>
        <Grid item xs={12} className="site-condition-container">
          <Dropdown
            value={siteCondition.council}
            label={"Council: "}
            handleChange={handleCouncil}
            disabled={true}
            size={12}
            items={[
              { label: siteCondition.council, value: siteCondition.council },
            ]}
          />
        </Grid>
        {siteCondition.council !== "" && (
          <>
            <Grid xs={12} item className="dst-mccc-logo">
              <img
                alt="neccc"
                src={
                  siteCondition.council === "MCCC"
                    ? "./mccc-logo.png"
                    : "./neccc-logo.png"
                }
              />
            </Grid>
            <DSTButton
              text="Start a new calculation"
              buttonClass="dst-button"
              size={12}
              theme="dstTheme"
              path={{
                type: "local",
                url: `/calculator`,
              }}
            />
            <DSTButton
              text="Import previous calculation"
              buttonClass="dst-import-button"
              size={12}
              theme="dstTheme"
              handleClick={setModal}
            />
            <CSVModal
              openModal={openModal}
              setModal={setModal}
              handleFileUpload={handleFileUpload}
              handleImportCSV={handleImportCSV}
            />
          </>
        )}
      </>
    );
  };

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Header
          className="header-container"
          headerVariant="dstHeaderHome"
          text="Seeding Rate Calculator"
          size={12}
          style={{ mt: 5 }}
        />
        {renderHome()}
      </Grid>
    </Fragment>
  );
};

export default Home;
