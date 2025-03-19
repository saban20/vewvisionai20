import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const AIAnalysisCard = ({ analysis }) => (
  <Card className="hologram-card" sx={{ mb: 4 }}>
    <CardContent>
      <Typography variant="h6" className="hologram">AI Analysis</Typography>
      <Typography>Population Percentile: {analysis.populationComparison.percentile}%</Typography>
    </CardContent>
  </Card>
);

export default AIAnalysisCard; 