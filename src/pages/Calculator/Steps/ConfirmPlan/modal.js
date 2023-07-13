import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Link, Button, Modal } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import DSTTable from "../../../../components/DSTTable";

export const NRCSDetailModal = ({ type, data, modalOpen, handleModalOpen }) => {
  const renderTable = () => {
    const createData = (label, expected, result, pass) => {
      return { label, expected, result, pass };
    };

    const rows = [
      createData("Brassicas", 0.5, 24, true),
      createData("Kale", 237, 9.0, false),
      createData("Spinach", 262, 16.0, true),
      createData("Forage", 305, 3.7, true),
      createData("Oats, Winter", 356, 16.0, false),
    ];

    const cells = ["label", "expected", "result", "pass"];
    return <DSTTable rows={rows} createData={createData} cells={cells} />;
  };
  return (
    <Modal
      open={modalOpen}
      onClose={handleModalOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="confirm-plan-modal">
        <Grid xs={12} container>
          <Grid xs={3} item></Grid>
          <Grid xs={6} item>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
            ></Typography>
          </Grid>
          <Grid xs={3} item></Grid>
          <Grid xs={2} item></Grid>
          <Grid xs={8} item>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {renderTable()}
            </Typography>
          </Grid>
          <Grid xs={2} item></Grid>
          <Grid xs={8} item></Grid>
          <Grid xs={4}>
            <Button
              sx={{ marginTop: "15px" }}
              onClick={() => {
                handleModalOpen();
              }}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default NRCSDetailModal;
