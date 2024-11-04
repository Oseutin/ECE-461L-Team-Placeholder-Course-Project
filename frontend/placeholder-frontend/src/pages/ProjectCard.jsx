import { Card, CardContent, Typography, Button } from "@mui/material";
import HardwareSet from "./HardwareSet";
import Grid from "@mui/material/Grid2";

const ProjectCard = ({ project, onToggleJoin, onCheckIn, onCheckOut }) => {
  return (
    <Card
      style={{
        marginBottom: "16px",
        backgroundColor: project.joined ? "#e0f7e0" : "#f5f5f5",
      }}
    >
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={3}>
            <Typography variant="h6" color="text.secondary">
              {project.name}
            </Typography>{" "}
          </Grid>
          <Grid item xs={6}>
            {project.hardware.map((set, index) => (
              <HardwareSet
                key={index}
                hardware={set}
                projectId={project.id}
                hardwareIndex={index}
                onCheckIn={onCheckIn}
                onCheckOut={onCheckOut}
              />
            ))}
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color={project.joined ? "secondary" : "primary"}
              onClick={() => onToggleJoin(project.id)}
              style={{ marginTop: "8px" }}
            >
              {project.joined ? "Leave" : "Join"}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
