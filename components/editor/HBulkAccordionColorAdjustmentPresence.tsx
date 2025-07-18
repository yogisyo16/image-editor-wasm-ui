import React from "react";
import { Stack, Typography, IconButton, CardMedia } from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";

interface Props {
    SaturationScore: number;
}

export default function HBulkAccordionColorAdjustmentPresence(props: Props) {
    const typography = useHonchoTypography();
    const colors = useColors();
    
    return(
        <>
            <Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: "8px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Saturation</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <IconButton value={props.SaturationScore}
                    sx={{ 
                        py: "5px",
                        margin: "0px",
                        px: "12px",
                        border: "1px solid white",
                        borderRadius: "20px",
                     }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" />
                    </IconButton>
                    <IconButton value={props.SaturationScore}
                    sx={{ 
                        py: "5px",
                        margin: "0px",
                        px: "12px",
                        border: "1px solid white",
                        borderRadius: "20px",
                     }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" />
                    </IconButton>
                    <IconButton value={props.SaturationScore}
                    sx={{ 
                        py: "5px",
                        margin: "0px",
                        px: "12px",
                        border: "1px solid white",
                        borderRadius: "20px",
                     }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ transform: "rotate(180deg)" }}/>
                    </IconButton>
                    <IconButton value={props.SaturationScore}
                    sx={{ 
                        py: "5px",
                        margin: "0px",
                        px: "12px",
                        border: "1px solid white",
                        borderRadius: "20px",
                     }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ transform: "rotate(180deg)" }}/>
                    </IconButton>
                </Stack>
            </Stack>
        </>
    )
}