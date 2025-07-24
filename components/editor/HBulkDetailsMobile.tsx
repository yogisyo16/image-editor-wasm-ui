import React from "react";
import { Stack, Slider, Typography, TextField, CardMedia, IconButton } from "@mui/material";
import useColors from "@/colors";
import useHonchoTypography from "@/honchoTheme";

interface Props {
    clarityScoreMinus10: number;
    clarityScoreMinus1: number;
    clarityScorePlus1: number;
    clarityScorePlus10: number;
    sharpnessScoreMinus10: number;
    sharpnessScoreMinus1: number;
    sharpnessScorePlus1: number;
    sharpnessScorePlus10: number;
    onClarityChange: (value: number) => void;
    onSharpnessChange: (value: number) => void;
}

export default function HBulkDetailsMobile(props: Props) {
    const typography = useHonchoTypography();
    const colors = useColors();

    return (
        <>
            <Stack spacing={0} direction="column" justifyContent="center" alignItems="flex-start" sx={{ width: '100%', pl: "10px", m: "0px" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: "6px" }}>
                    <Typography sx={{ ...typography.bodyMedium, color: colors.surface }}>Clarity</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "16px" }}>
                    <IconButton value={props.clarityScoreMinus10}
                    sx={{
                        width: "76px",
                        height: "28px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ width: "20px", height: "20px", mr: "2px" }}/>
                    </IconButton>
                    <IconButton value={props.clarityScoreMinus1}
                    sx={{
                        width: "76px",
                        height: "28px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ width: "20px", height: "20px", mr: "3px" }}/>
                    </IconButton>
                    <IconButton value={props.clarityScorePlus1}
                    sx={{
                        width: "76px",
                        height: "28px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ width: "20px", height: "20px", ml: "3px" }}/>
                    </IconButton>
                    <IconButton value={props.clarityScorePlus10}
                    sx={{
                        width: "76px",
                        height: "28px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ width: "20px", height: "20px", ml: "2px" }}/>
                    </IconButton>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: "6px" }}>
                    <Typography sx={{ ...typography.bodyMedium, color: colors.surface }}>Sharpness</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton value={props.sharpnessScoreMinus10}
                    sx={{
                        width: "76px",
                        height: "28px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ width: "20px", height: "20px", mr: "2px" }}/>
                    </IconButton>
                    <IconButton value={props.sharpnessScoreMinus1}
                    sx={{
                        width: "76px",
                        height: "28px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ width: "20px", height: "20px", mr: "3px" }}/>
                    </IconButton>
                    <IconButton value={props.sharpnessScorePlus1}
                    sx={{
                        width: "76px",
                        height: "28px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ width: "20px", height: "20px", ml: "3px" }}/>
                    </IconButton>
                    <IconButton value={props.sharpnessScorePlus10}
                    sx={{
                        width: "76px",
                        height: "28px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ width: "20px", height: "20px", ml: "2px" }}/>
                    </IconButton>
                </Stack>
            </Stack>
        </>
    )
}