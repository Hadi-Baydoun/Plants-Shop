import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { rows, columns } from "./data";
import Header from "../../components/Header";


export default function Contacts() {
    return (
        <Box style={{ height: 600, width: "98%", mx: "auto" }}>
            <Header
                title="CONTACTS"
                subTitle="List of Contacts for Future Reference"
            />
            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={rows}
                // @ts-ignore
                columns={columns}

            />
        </Box>
    )
}
