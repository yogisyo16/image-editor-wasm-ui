import React from "react";
import { Stack, Typography, IconButton, CardMedia } from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";

interface Props {
    adjustClarity: (amount: number) => void;
    adjustSharpness: (amount: number) => void;
}

export default function HBulkAccordionColorAdjustmentWhiteBalance(props: Props) {
    const typography = useHonchoTypography();
    const colors = useColors();
    
    return(
        <>
            <Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ pb: "8px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Clarity</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton onClick={() =>props.adjustClarity(-10)}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ mr: "2px" }}/>
                    </IconButton>
                    <IconButton onClick={() =>props.adjustClarity(-1)}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ mr: "3px" }}/>
                    </IconButton>
                    <IconButton onClick={() =>props.adjustClarity(1)}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ml: "3px" }}/>
                    </IconButton>
                    <IconButton onClick={() =>props.adjustClarity(10)}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ml: "2px" }}/>
                    </IconButton>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ pb: "8px", pt: "16px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Sharpness</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton onClick={() =>props.adjustSharpness(-10)}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ mr: "2px" }}/>
                    </IconButton>
                    <IconButton onClick={() =>props.adjustSharpness(-1)}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ mr: "3px" }}/>
                    </IconButton>
                    <IconButton onClick={() =>props.adjustSharpness(1)}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ ml: "3px" }}/>
                    </IconButton>
                    <IconButton onClick={() =>props.adjustSharpness(10)}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ ml: "2px" }}/>
                    </IconButton>
                </Stack>
            </Stack>
        </>
    )
}