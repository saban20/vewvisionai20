import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const ProductRecommendationCard = ({ product }) => (
  <Card className="hologram-card">
    <CardContent>
      <Typography variant="h6">{product.name}</Typography>
      <Typography>${product.price}</Typography>
      <Button className="hologram-button" sx={{ mt: 2 }}>Add to Cart</Button>
    </CardContent>
  </Card>
);

export default ProductRecommendationCard; 