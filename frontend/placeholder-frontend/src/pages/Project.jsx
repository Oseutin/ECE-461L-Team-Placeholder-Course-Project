import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Project() {
  const location = useLocation();
  const user = location.state.user;
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const navigate = useNavigate();

  const handleClickOpenCreate = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreate = () => {
    setOpenCreateDialog(false);
    resetFields();
  };

  const handleClickOpenJoin = () => {
    setOpenJoinDialog(true);
  };

  const handleCloseJoin = () => {
    setOpenJoinDialog(false);
    resetFields();
  };

  const resetFields = () => {
    setProjectId("");
    setProjectName("");
    setProjectDescription("");
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch("/create_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.username,
          project_data: {
            id: projectId,
            name: projectName,
            description: projectDescription,
          },
        }),
      });
      if (response.ok) {
        alert("Your project has been created successfully.");
        handleCloseCreate();
      } else {
        alert("Project ID already exists. Please try a new ID.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleJoinProject = async () => {
    try {
      const response = await fetch("/join_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.username,
          id: projectId,
        }),
      });
      if (response.ok) {
        alert("You have joined the project successfully.");
        handleCloseJoin();
      } else {
        alert(
          "Project ID either does not exist or you have already joined it. Please try a new ID.",
        );
      }
    } catch (error) {
      console.error("Error joining project:", error);
    }
  };

  const handleOpenHardware = () => {
    navigate("/hardware", { state: { user: user } });
  };

  const inputStyles = {
    input: { color: "blue" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "blue",
      },
      "&.Mui-focused fieldset": {
        borderColor: "blue",
      },
    },
    "& .MuiInputLabel-root": {
      color: "blue",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "blue",
    },
    marginBottom: 2,
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpenCreate}
        >
          Create Project
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClickOpenJoin}
        >
          Join Project
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenHardware}
        >
          View Hardware
        </Button>
      </Box>

      <Dialog
        open={openJoinDialog}
        onClose={handleCloseJoin}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "16px",
            backgroundColor: "#f5f5f5",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#3f51b5",
            textAlign: "center",
          }}
        >
          Join Project
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              color: "black",
              marginBottom: "16px",
              fontSize: "1rem",
              lineHeight: "1.5",
            }}
          >
            Please enter the Project ID you wish to join:
          </DialogContentText>
          <TextField
            label="Project ID"
            fullWidth
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            sx={inputStyles}
          />
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button onClick={handleCloseJoin} color="error" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleJoinProject}
            color="primary"
            variant="contained"
          >
            Join
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreate}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "16px",
            backgroundColor: "#f5f5f5",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#3f51b5",
            textAlign: "center",
          }}
        >
          Create New Project
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              color: "black",
              marginBottom: "16px",
              fontSize: "1rem",
              lineHeight: "1.5",
            }}
          >
            To create a new project, please enter the project details:
          </DialogContentText>
          <TextField
            label="Project ID"
            fullWidth
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            sx={inputStyles}
          />
          <TextField
            label="Project Name"
            fullWidth
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            sx={inputStyles}
          />
          <TextField
            label="Project Description"
            fullWidth
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            sx={inputStyles}
          />
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button onClick={handleCloseCreate} color="error" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
