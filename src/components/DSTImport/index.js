import Papa from "papaparse";

import { DSTButton } from "../Button";
import { CSVModal } from "./CSVModal";

import "./DSTImport.css";

const DSTImport = ({
  handleModal,
  setCSVImport,
  CSVImport,
  navigate,
  dispatch,
  updateAllSteps,
  setOpenModal,
  openModal,
}) => {
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
    dispatch(updateAllSteps({ value: CSVImport }));
    navigate(`/calculator`);
  };
  const setModal = () => {
    setOpenModal(!openModal);
  };
  return (
    <>
      <CSVModal
        openModal={openModal}
        setModal={setModal}
        handleFileUpload={handleFileUpload}
        handleImportCSV={handleImportCSV}
      />
      <DSTButton
        text="Import previous calculation"
        buttonClass="dst-import-button"
        size={12}
        theme="dstTheme"
        handleClick={setModal}
      />
    </>
  );
};

export default DSTImport;
