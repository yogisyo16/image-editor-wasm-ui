import React from "react";
import { Stack, Slider, Typography, TextField, CardMedia, IconButton } from "@mui/material";
import useColors from "@/colors";
import useHonchoTypography from "@/honchoTheme";

interface Props {
    clarityScore: number;
    sharpnessScore: number;
    onClarityChange: (value: number) => void;
    onSharpnessChange: (value: number) => void;
}

export default function HBulkDetailsMobile(props: Props) {
    const typography = useHonchoTypography();
    const colors = useColors();

    const formatValue = (value: number) => {
                if (value > 0) return `+${value}`;
                return value.toString();
            };
                
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, min: number, max: number, onChange: (value: number) => void) => {
        const value = event.target.value;
        if (value === '+' || value === '-') return;
        let numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) numericValue = 0;
        const clampedValue = Math.max(min, Math.min(max, numericValue));
        onChange(clampedValue);
    };
    return (
        <>
            <Stack spacing={0} direction="column" justifyContent="center" alignItems="flex-start" sx={{ width: '100%', pl: "10px", m: "0px" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: "6px" }}>
                    <Typography sx={{ ...typography.bodyMedium, color: colors.surface }}>Clarity</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "16px" }}>
                    <IconButton value={props.clarityScore}
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
                    <IconButton value={props.clarityScore}
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
                    <IconButton value={props.clarityScore}
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
                    <IconButton value={props.clarityScore}
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
                    <IconButton value={props.sharpnessScore}
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
                    <IconButton value={props.sharpnessScore}
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
                    <IconButton value={props.sharpnessScore}
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
                    <IconButton value={props.sharpnessScore}
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