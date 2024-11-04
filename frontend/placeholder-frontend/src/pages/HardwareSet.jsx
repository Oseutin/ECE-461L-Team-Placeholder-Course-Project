import { useState } from "react";
import { Grid, TextField, Button, Typography } from "@mui/material";

const HardwareSet = ({ hardware, projectId, hardwareIndex, onCheckIn, onCheckOut }) => {
    const [quantity, setQuantity] = useState(0);

    const handleQuantityChange = (event) => {
        const value = Math.max(0, Number(event.target.value));  // Ensure quantity is non-negative
        setQuantity(value);
    };

    return (
        <div>
            <Grid container alignItems="center" spacing={1} style={{ marginBottom: "8px" }}>
                <Grid item xs={4}>
                    <Typography variant="body2">
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
