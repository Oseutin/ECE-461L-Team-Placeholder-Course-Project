import React, { useEffect, useState } from 'react';
import HardwareSet from './HardwareSet';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function Project({ project, auth, refreshProjects, fetchHardwareSets, handleLeaveProject }) {
    const [hardwareSets, setHardwareSets] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const loadHardwareSets = async () => {
            const sets = await fetchHardwareSets(project.projectId);
            setHardwareSets(sets);
        };
        loadHardwareSets();
    }, [project.projectId, fetchHardwareSets]);

    const handleCopyProjectId = (projectId) => {
        navigator.clipboard.writeText(projectId);
        setSnackbar({ open: true, message: 'Project ID copied to clipboard.', severity: 'success' });
    };

    return (
        <Card style={{ marginBottom: '20px' }}>
            <CardContent>
                <Typography variant="h6">
                    {project.projectName} <span style={{ fontSize: '0.8em', color: 'gray' }}> (Project ID: {project.projectId}
                    <Button onClick={() => handleCopyProjectId(project.projectId)} style={{ marginLeft: '5px' }} title="Copy Project ID">
                        <ContentCopy fontSize="small" />
                    </Button>)</span>
                </Typography>
                <Typography variant="body2" color="textSecondary">{project.description}</Typography>

                <Box marginTop="15px">
                    <Typography variant="h6">Hardware Sets</Typography>
                    {hardwareSets.map((hwSet) => (
                        <HardwareSet 
                            key={hwSet.hwName} 
                            hardwareSet={hwSet} 
                            projectId={project.projectId} 
                            auth={auth} 
                            refreshProjects={refreshProjects} 
                        />
                    ))}
                </Box>
            </CardContent>
            <Box display="flex" justifyContent="flex-end" margin="10px">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleLeaveProject(project.projectId)}
                >
                    Leave Project
                </Button>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Card>
    );
}

export default Project;
