import { Card, CardActions, CardContent, CardMedia, Button, Typography } from "@mui/material";

const ProductCard = ({ product, handleOpen, openDeleteDialog }) => (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardMedia
            component="img"
            height="190"
            image={product.image_url}
            alt={product.name}
            sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography
                gutterBottom
                variant="h6"
                component="div"
                noWrap
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
                {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Rating: {product.rating}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Quantity: {product.quantity}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Price: ${product.price}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Category: {product.subCategories?.category?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                SubCategory: {product.subCategories?.name}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" color="primary" onClick={() => handleOpen(product)}>
                Edit
            </Button>
            <Button size="small" color="secondary" onClick={() => openDeleteDialog(product)}>
                Delete
            </Button>
        </CardActions>
    </Card>
);

export default ProductCard;
