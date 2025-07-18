import React from "react";
import { Stack, Slider, Typography, TextField } from "@mui/material";
import useColors from "@/colors";
import useHonchoTypography from "@/honchoTheme";

interface Props {
    saturationScore: number;
    onSaturationChange: (value: number) => void;
}

export default function HSliderPresenceMobile (props: Props) {
    const colors = useColors();
    const typography = useHonchoTypography();


    const saturationColors = ['yellow', 'lime', 'deepskyblue', 'magenta', 'red'];
    const greyScaleStart = '#000000'; // Black at -100
    const greyScaleEnd = '#ffffff'; // White at 0 (or a very light grey)

    const colorStops = saturationColors.map((color, index) => {
        const position = 50 + (index / (saturationColors.length - 1)) * 50;
        return `${color} ${position}%`;
    }).join(', ');

    // The gradient for the *entire* background of the slider bar
    const fullTrackGradient = `linear-gradient(to right, ${greyScaleStart} 0%, ${greyScaleEnd} 50%, ${colorStops})`;

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        let numericValue = parseInt(value, 10);

        if (isNaN(numericValue)) {
            numericValue = 0;
        }

        const clampedValue = Math.max(-100, Math.min(100, numericValue));

        props.onSaturationChange(clampedValue);
    };

    return (
        <Stack spacing={0} direction="column" sx={{ width: '100%', paddingX: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ ...typography.bodyMedium, color: colors.surface }}>
                    Saturation
                </Typography>
                <TextField
                    hiddenLabel
                    id="filled-hidden-label-small"
                    value={props.saturationScore}
                    variant="filled"
                    onChange={handleTextFieldChange}
                    sx={{
                        width: "40px",
                        alignItems: "center",
                        textAlign: "center",
                        '& .MuiFilledInput-root': {
                            backgroundColor: 'transparent',
                            border: 'none',
                            '&:before': {
                                borderBottom: 'none',
                            },
                            '&:after': {
                                borderBottom: 'none',
                            },
                            '&:hover:not(.Mui-disabled):before': {
                                borderBottom: 'none',
                            },
                            '&.Mui-focused:after': {
                                borderBottom: 'none',
                            },
                        },
                        '& .MuiFilledInput-input': {
                            textAlign: 'center',
                            padding: 0,
                            color: colors.surface,
                        }
                    }}/>
            </Stack>
            <Stack direction="row" justifyContent="center" alignItems="center">
                <Slider
                    sx={{
                        width: "95%",
                        color: colors.surface,
                        '& .MuiSlider-rail': {
                            background: fullTrackGradient,
                            opacity: 1,
                        },
                        '& .MuiSlider-track': {
                            background: 'transparent',
                            border: 'none',
                        }
                    }}
                    size="small"
                    value={props.saturationScore}
                    step={1}
                    min={-100}
                    max={100}
                    onChange={(_event, newValue) => props.onSaturationChange(newValue as number)}
                />
            </Stack>
        </Stack>
    )
}