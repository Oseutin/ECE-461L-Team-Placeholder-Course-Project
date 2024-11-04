import { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const HardwareSet = ({
  hardware,
  projectId,
  hardwareIndex,
  onCheckIn,
  onCheckOut,
}) => {
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (event) => {
    const value = Math.max(0, Number(event.target.value));
    setQuantity(value);
  };

  return (
    <div>
      <Grid
        container
        alignItems="center"
        spacing={1}
        style={{ marginBottom: "8px" }}
      >
        <Grid item xs={4}>
          <Typography variant="body2" color="text.secondary">
            {hardware.name}: {hardware.checkedOut}/{hardware.total}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                size="small"
                label="Enter qty"
                fullWidth
                value={quantity}
                onChange={handleQuantityChange}
                type="number"
                InputLabelProps={{
                  style: { color: "#000000" }, // Label color
                }}
                InputProps={{
                  style: { color: "#000000" }, // Input text color
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#000000", // Border color
                    },
                    "&:hover fieldset": {
                      borderColor: "#000000", // Border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#000000", // Border color on focus
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => onCheckIn(projectId, hardwareIndex, quantity)}
              >
                Check In
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => onCheckOut(projectId, hardwareIndex, quantity)}
              >
                Check Out
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default HardwareSet;
