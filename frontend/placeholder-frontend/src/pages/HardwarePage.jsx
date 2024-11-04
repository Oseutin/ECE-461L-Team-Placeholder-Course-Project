import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { Container, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const HardwarePage = () => {
  const location = useLocation();
  const user = location.state.user;
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Project Name 1",
      hardware: [
        { name: "HWSet1", checkedOut: 50, total: 100 },
        { name: "HWSet2", checkedOut: 0, total: 100 },
      ],
      joined: false,
    },
    {
      id: 2,
      name: "Project Name 2",
      hardware: [
        { name: "HWSet1", checkedOut: 50, total: 100 },
        { name: "HWSet2", checkedOut: 0, total: 100 },
      ],
      joined: true,
    },
    {
      id: 3,
      name: "Project Name 3",
      hardware: [
        { name: "HWSet1", checkedOut: 0, total: 100 },
        { name: "HWSet2", checkedOut: 0, total: 100 },
      ],
      joined: false,
    },
  ]);

  const toggleJoinProject = async (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    const url = project.joined ? `/leave/${projectId}` : `/join/${projectId}`;

    try {
      const response = await fetch(url, { method: "POST" });
      const data = await response.json();
      alert(data.message);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? { ...project, joined: !project.joined }
            : project,
        ),
      );
    } catch (error) {
      console.error("Error toggling project join status:", error);
    }
  };

  const handleCheckIn = async (projectId, hardwareIndex, quantity) => {
    try {
      const response = await fetch(`/checkin/${projectId}/${quantity}`, {
        method: "POST",
      });
      const data = await response.json();
      alert(data.message);

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                hardware: project.hardware.map((hwSet, index) =>
                  index === hardwareIndex
                    ? {
                        ...hwSet,
                        checkedOut: Math.min(
                          hwSet.checkedOut + quantity,
                          hwSet.total,
                        ),
                      }
                    : hwSet,
                ),
              }
            : project,
        ),
      );
    } catch (error) {
      console.error("Error checking in hardware:", error);
    }
  };

  const handleCheckOut = async (projectId, hardwareIndex, quantity) => {
    try {
      const response = await fetch(`/checkout/${projectId}/${quantity}`, {
        method: "POST",
      });
      const data = await response.json();
      alert(data.message);

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                hardware: project.hardware.map((hwSet, index) =>
                  index === hardwareIndex
                    ? {
                        ...hwSet,
                        checkedOut: Math.max(hwSet.checkedOut - quantity, 0),
                      }
                    : hwSet,
                ),
              }
            : project,
        ),
      );
    } catch (error) {
      console.error("Error checking out hardware:", error);
    }
  };

  return (
    <Container>
      <h1>Projects</h1>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onToggleJoin={toggleJoinProject}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/projects", { state: { user: user } })}
        style={{ marginTop: "16px" }}
      >
        Return to Project Page
      </Button>
    </Container>
  );
};

export default HardwarePage;
