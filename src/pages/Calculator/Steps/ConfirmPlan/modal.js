import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Link, Button, Modal } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import DSTTable from "../../../../components/DSTTable";

export const NRCSDetailModal = ({ type, data, modalOpen, handleModalOpen }) => {
  const renderTable = () => {
    const createData = (label, expect, result, pass) => {
      return { label, expect, result, pass };
    };

    const rows = data.seeds.map((d, i) => {
      return createData(
        d.label,
        JSON.stringify(d.expect),
        d.result,
        d.pass ? "passed" : "failed"
      );
    });

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
