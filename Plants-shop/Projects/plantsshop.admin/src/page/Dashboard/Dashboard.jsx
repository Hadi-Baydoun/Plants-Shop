import { Box, Grid, Pagination, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useOutletContext } from "react-router-dom";
import ProductCard from "./DashboardComponents/ProductCard";
import DeleteProduct from "./DashboardComponents/DeleteProduct";
import EditProduct from "./DashboardComponents/EditProduct";
import DashboardHeader from "./DashboardComponents/DashboardHeader";

const PRODUCTS_PER_PAGE = 8;

const Dashboard = () => {
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [apiHost, setApiHost] = useState("");
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const { searchTerm } = useOutletContext();

    const openDeleteDialog = (product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
    };
    // Fetch Products

    const fetchProducts = () => {
        axios
            .get("/src/assets/Constants.json")
            .then((response) => {
                const apiBaseUrl = response.data.API_HOST;
                setApiHost(apiBaseUrl);
                return axios.get(`${apiBaseUrl}/api/Products/all`);
            })
            .then((response) => {
                const productsData = response.data.map(product => {
                    return {
                        ...product,
                        categoryName: product.subCategories.category.name
                    };
                });
                setProducts(productsData);
            })
            .catch((error) => {
                console.error("Error fetching products:");
            });

        // Fetch subcategories

        axios
            .get("/src/assets/Constants.json")
            .then((response) => {
                const apiBaseUrl = response.data.API_HOST;
                return axios.get(`${apiBaseUrl}/api/SubCategories/all`);
            })
            .then((response) => {
                setSubcategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching subcategories:");
            });
    };

    useEffect(fetchProducts, []);

    // Open edit product modal

    const handleOpen = (product) => {
        setEditProduct(product);
        setOpen(true);
    };

    // Close edit product modal

    const handleClose = () => {
        setOpen(false);
        setEditProduct(null);
    };

    // Handle changes to the product being edited

    const handleEdit = (field, value) => {
        setEditProduct((prev) => {
            switch (field) {
                case "Name":
                    return { ...prev, name: value };
                case "Description":
                    return { ...prev, description: value };
                case "ImageUrl":
                    return { ...prev, image_url: value };
                case "Quantity":
                    return { ...prev, quantity: parseInt(value) };
                case "Price":
                    return { ...prev, price: parseFloat(value) };
                case "Rating":
                    return { ...prev, rating: parseFloat(value) };
                case "sub_categories_id":
                    const selectedSubcategory = subcategories.find(
                        (subcategory) => subcategory.id === parseInt(value)
                    );
                    return {
                        ...prev,
                        sub_categories_id: parseInt(value),
                        subCategories: selectedSubcategory,
                    };
                default:
                    return prev;
            }
        });
    };

    const handleDelete = () => {
        if (productToDelete) {
            axios
                .get("/src/assets/Constants.json")
                .then((response) => {
                    const apiBaseUrl = response.data.API_HOST;
                    return axios.delete(`${apiBaseUrl}/api/Products/delete?id=${productToDelete.id}`);
                })
                .then((response) => {
                    setProducts(response.data);
                    closeDeleteDialog();
                })
                .catch((error) => {
                    alert("Error deleting product.");
                    closeDeleteDialog();
                });
        }
    };

    const handleSave = () => {
        axios
            .get("/src/assets/Constants.json")
            .then((response) => {
                const apiBaseUrl = response.data.API_HOST;
                return axios.put(`${apiBaseUrl}/api/Products/update`, editProduct);
            })
            .then((response) => {
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === editProduct.id ? editProduct : product
                    )
                );
            })
            .catch((error) => {
                alert("Error updating product.");
            });
        handleClose();
    };

    // Filter products based on search term and selected category

    const filteredProducts = products.filter(
        (product) =>
            (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategory
                ? product.subCategories &&
                product.subCategories.category &&
                product.subCategories.category.name === selectedCategory
                : true)
    );

    // Pagination

    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length);
    const displayedProducts = filteredProducts.slice(startIndex, endIndex);
    const totalPages = Math.max(Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE), 1);


    // Get unique categories from subcategories

    const uniqueCategories = new Set();
    subcategories.forEach((subcategory) => {
        if (subcategory.category) {
            uniqueCategories.add(subcategory.category.name);
        }
    });

    const uniqueCategoryArray = Array.from(uniqueCategories);

    return (
        <Box p={1}>
            <DashboardHeader
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                uniqueCategoryArray={uniqueCategoryArray}
            />
            <Grid container spacing={2} mt={0}>
                {displayedProducts.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <ProductCard
                            product={product}
                            handleOpen={handleOpen}
                            openDeleteDialog={openDeleteDialog}
                        />
                    </Grid>
                ))}
            </Grid>
            <DeleteProduct
                isDeleteDialogOpen={isDeleteDialogOpen}
                closeDeleteDialog={closeDeleteDialog}
                handleDelete={handleDelete}
                productToDelete={productToDelete}
            />
            <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                />
            </Box>
            {editProduct && (
                <EditProduct
                    open={open}
                    handleClose={handleClose}
                    handleEdit={handleEdit}
                    handleSave={handleSave}
                    editProduct={editProduct}
                    subcategories={subcategories}
                />
            )}
        </Box>
    );
};
export default Dashboard;
