import { Modal, Card, CardContent, CardActions, TextField, MenuItem, Button, Stack } from "@mui/material";

const EditProduct = ({ open, handleClose, handleEdit, handleSave, editProduct, subcategories }) => (
    <Modal
        open={open}
        onClose={handleClose}
        sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(5px)",
        }}
    >
        <Card sx={{ width: { xs: '90%', sm: 600, md: 700 }, p: 2 }}>
            <CardContent>
                <Stack spacing={2}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={editProduct.name}
                        onChange={(e) => handleEdit("Name", e.target.value)}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Description"
                        value={editProduct.description}
                        onChange={(e) => handleEdit("Description", e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Rating"
                        type="number"
                        sx={{ flex: 1 }}
                        value={editProduct.rating}
                        onChange={(e) => handleEdit("Rating", e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={editProduct.quantity}
                        sx={{ flex: 1 }}
                        onChange={(e) => handleEdit("Quantity", e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        sx={{ flex: 1 }}
                        value={editProduct.price}
                        onChange={(e) => handleEdit("Price", e.target.value)}
                    />
                    <TextField
                        variant="filled"
                        select
                        label="Subcategory"
                        value={editProduct.sub_categories_id}
                        onChange={(e) => handleEdit("sub_categories_id", e.target.value)}
                    >
                        {subcategories.map((subcategory) => (
                            <MenuItem key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
                <Button fullWidth color="primary" onClick={handleSave}>
                    Save
                </Button>
            </CardActions>
        </Card>
    </Modal>
);

export default EditProduct;
