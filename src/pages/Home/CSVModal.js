import { Box } from "@mui/system";
import { Grid, Modal, Typography, Button } from "@mui/material";

export const CSVModal = ({
  openModal,
  setModal,
  handleFileUpload,
  handleImportCSV,
}) => {
  return (
    <Modal
      open={openModal}
      onClose={setModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="home-import-modal">
        <Grid xs={12} container>
          <Grid xs={3} item></Grid>
          <Grid xs={6} item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Import a CSV file
            </Typography>
          </Grid>
          <Grid xs={3} item></Grid>
          <Grid xs={2} item></Grid>
          <Grid xs={8} item>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <input type="file" accept=".csv" onChange={handleFileUpload} />
            </Typography>
          </Grid>
          <Grid xs={2} item></Grid>
          <Grid xs={8} item></Grid>
          <Grid xs={4}>
            <Button
              sx={{ marginTop: "15px" }}
              onClick={(e) => {
                handleImportCSV(e);
              }}
            >
              Import CSV
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
