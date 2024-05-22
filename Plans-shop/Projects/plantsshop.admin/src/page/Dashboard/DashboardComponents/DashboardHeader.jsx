import { Box, TextField, MenuItem, Stack } from "@mui/material";
import Header from "../../../components/Header";

const DashboardHeader = ({ selectedCategory, setSelectedCategory, uniqueCategoryArray }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Header isDashboard={true} title="DASHBOARD" subTitle="View and Edit Products" />
        <Box sx={{ textAlign: "right", mb: 1.3 }}>
            <TextField
                color="primary"
                select
                label="Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{ minWidth: "150px", marginRight: "10px" }}
            >
                <MenuItem value={null}>All</MenuItem>
                {uniqueCategoryArray.map((categoryName) => (
                    <MenuItem key={categoryName} value={categoryName}>
                        {categoryName}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    </Stack>
);

export default DashboardHeader;
