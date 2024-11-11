import React, { useEffect, useState } from 'react';
import HardwareSet from './HardwareSet';
import { Card, CardContent, Typography, Box } from '@mui/material';

function Project({ project, auth, refreshProjects, fetchHardwareSets }) {
    const [hardwareSets, setHardwareSets] = useState([]);

    useEffect(() => {
        const loadHardwareSets = async () => {
            const sets = await fetchHardwareSets(project.projectId);
            setHardwareSets(sets);
        };
        loadHardwareSets();
    }, [project.projectId, fetchHardwareSets]);

    return (
        <Card style={{ marginBottom: '20px' }}>
            <CardContent>
                <Typography variant="h6">{project.projectName}</Typography>
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
        </Card>
    );
}

export default Project;
