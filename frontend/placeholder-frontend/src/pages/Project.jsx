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
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
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
      } else {
        alert("Project ID does not exist. Please try a new ID.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };
  const handleOpenHardware = () => {
    navigate("/hardware", { state: { user: user } });
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
      {/* Create and Join Project Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Create Project
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClickOpen2}
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
      {/* Dialog for Creating a New Project */}
      <Dialog
        open={open2}
        onClose={handleClose2}
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
          <Box sx={{ width: 500, maxWidth: "100%" }}>
            <TextField
              label="Project ID"
              fullWidth
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              sx={{
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
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <Button onClick={handleClose2} color="error" variant="outlined">
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

      {/* Dialog for Creating a New Project */}
      <Dialog
        open={open}
        onClose={handleClose}
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
            To create a new project, please enter a project ID:
          </DialogContentText>
          <Box sx={{ width: 500, maxWidth: "100%" }}>
            <TextField
              label="Project ID"
              fullWidth
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              sx={{
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
              }}
            />
            <TextField
              label="Project Name"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              sx={{
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
              }}
            />
            <TextField
              label="Project Description"
              fullWidth
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              sx={{
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
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <Button onClick={handleClose} color="error" variant="outlined">
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
