import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

const DeleteProduct = ({ isDeleteDialogOpen, closeDeleteDialog, handleDelete, productToDelete }) => (
    <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to delete "{productToDelete?.name}"?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
                Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
                Delete
            </Button>
        </DialogActions>
    </Dialog>
);

export default DeleteProduct;
