import React from "react";
import { Stack, Typography, IconButton, CardMedia } from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";

interface Props {
    tempScore: number;
    tintScore: number;
    saturationScore: number;
}

export default function HBulkAccordionColorAdjustmentColors(props: Props) {
    const typography = useHonchoTypography();
    const colors = useColors();
    
    return(
        <>
            <Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ pb: "8px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Temperature</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton
                        value={props.tempScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
                            py: "2px",
                            mr: "12px",
                            border: "1px solid white",
                            borderRadius: "100px",
                        }}>
                            <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ mr: "2px" }}/>
                    </IconButton>
                    <IconButton 
                        value={props.tempScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
                            py: "2px",
                            mr: "12px",
                            border: "1px solid white",
                            borderRadius: "20px",
                        }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ mr: "3px" }}/>
                    </IconButton>
                    <IconButton 
                        value={props.tempScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
                            py: "2px",
                            mr: "12px",
                            border: "1px solid white",
                            borderRadius: "100px",
                        }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ml: "3px" }}/>
                    </IconButton>
                    <IconButton 
                        value={props.tempScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
                            py: "2px",
                            mr: "12px",
                            border: "1px solid white",
                            borderRadius: "100px",
                        }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ ml: "2px" }}/>
                    </IconButton>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ pb: "8px", pt: "16px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Tint</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton 
                        value={props.tintScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
                            py: "2px",
                            mr: "12px",
                            border: "1px solid white",
                            borderRadius: "100px",
                        }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ mr: "2px" }}/>
                    </IconButton>
                    <IconButton 
                        value={props.tintScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
                            py: "2px",
                            mr: "12px",
                            border: "1px solid white",
                            borderRadius: "100px",
                        }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ mr: "3px" }}/>
                    </IconButton>
                    <IconButton 
                        value={props.tintScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
                            py: "2px",
                            mr: "12px",
                            border: "1px solid white",
                            borderRadius: "100px",
                        }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ml: "3px" }}/>
                    </IconButton>
                    <IconButton 
                        value={props.tintScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
                            py: "2px",
                            mr: "12px",
                            border: "1px solid white",
                            borderRadius: "100px",
                        }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ ml: "2px" }}/>
                    </IconButton>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ pb: "8px", pt: "16px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Saturation</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton 
                        value={props.saturationScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
                            py: "2px",
                            mr: "12px",
                            border: "1px solid white",
                            borderRadius: "100px",
                        }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ mr: "2px" }}/>
                    </IconButton>
                    <IconButton 
                        value={props.saturationScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
                            py: "2px",
                            mr: "12px",
                            border: "1px solid white",
                            borderRadius: "100px",
                        }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ mr: "3px" }}/>
                    </IconButton>
                    <IconButton 
                        value={props.saturationScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
                            py: "2px",
                            mr: "12px",
                            border: "1px solid white",
                            borderRadius: "100px",
                        }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ml: "3px" }}/>
                    </IconButton>
                    <IconButton 
                        value={props.saturationScore}
                        sx={{
                            width: "38.5px",
                            height: "26px",
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