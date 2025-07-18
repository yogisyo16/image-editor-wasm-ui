import React from "react";
import { Box, Stack, Slider, Typography, TextField } from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";

interface Props {
    TempScore: number;
    TintScore: number;
    SaturationScore: number;
    onTempChange: (value: number) => void;
    onTintChange: (value: number) => void;
    onSaturationChange: (value: number) => void;
}

export default function HAccordionWhiteBalance(props: Props) {
    const typography = useHonchoTypography();
    const colors = useColors();
    
    const blueScale = '#292bc0'; // Blue color on left
    const yellowScale = '#dfdc28';   // Yellow color on right

    const greenScale = '#00ff04';
    const purpleScale = '#b700ff';
    
    // The gradient for the *entire* background of the slider bar
    const tempGradient = `linear-gradient(to right, ${blueScale} 35%, ${yellowScale} 75%)`;
    const tintGradient = `linear-gradient(to right, ${greenScale} 20%, ${purpleScale} 75%)`;

        const spectrumColorsSaturation = ['yellow', 'lime', 'deepskyblue', 'magenta', 'red'];
    const greyScaleStart = '#000000'; // Black at -100
    const greyScaleEnd = '#ffffff';   // White at 0 (or a very light grey)

    const colorStops = spectrumColorsSaturation.map((color, index) => {
        const position = 50 + (index / (spectrumColorsSaturation.length - 1)) * 50;
        return `${color} ${position}%`;
    }).join(', ');

    // The gradient for the *entire* background of the slider bar
    const fullTrackGradient = `linear-gradient(to right, ${greyScaleStart} 0%, ${greyScaleEnd} 50%, ${colorStops})`;

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

    return(
        <>
            <Stack>
                <Stack direction="column" gap="4px" sx={{pt: '6px', pb: '2px', px: '0px', mx: '0px'}}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{...typography.bodyMedium}}>Temperature</Typography>
                        <TextField
                            hiddenLabel
                            id="filled-hidden-label-small"
                            value={formatValue(props.TempScore)}
                            variant="filled"
                            onChange={(e) => handleInputChange(e, -100, 100, props.onTempChange)}
                            sx={{
                                width: "40px", 
                                height: "10px", 
                                alignItems: "center", 
                                textAlign: "right", 
                                display: "flex",
                                '& .MuiFilledInput-root': {
                                    backgroundColor: 'transparent',
                                    borderRadius: "0px",
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
                                    textAlign: 'right',
                                    padding: 0,
                                    pr: '4px',
                                    color: colors.surface,
                                    fontSize: "14px",
                                },
                                '& .Mui-focused' : {
                                    '& .MuiFilledInput-input': {
                                        backgroundColor: "#1C1B1FB2",
                                        textAlign: 'right',
                                        borderRadius: '5px 5px 0px 0px',
                                        borderBottom: 'none',
                                        // pr: '8px',
                                        pl: '2px',
                                    }
                                }
                            }}/>
                    </Stack>
                    <Slider
                        sx={{
                            width: "200px",
                            color: colors.surface,
                            '& .MuiSlider-rail': {
                                background: tempGradient,
                                opacity: 1,
                            },
                            '& .MuiSlider-track': {
                                background: 'transparent',
                                border: 'none',
                            }
                        }}
                        size="small"
                        value={props.TempScore}
                        step={1}
                        min={-100}
                        max={100}
                        onChange={(_event, newValue) => props.onTempChange(newValue as number)}
                    />
                </Stack>
                <Stack direction="column" gap="3px" sx={{pt: '10px', pb: '0px', px: '0px', mx: '0px'}}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{...typography.bodyMedium}}>Tint</Typography>
                        <TextField
                            hiddenLabel
                            id="filled-hidden-label-small"
                            value={formatValue(props.TintScore)}
                            variant="filled"
                            onChange={(e) => handleInputChange(e, -100, 100, props.onTintChange)}
                            sx={{
                                width: "40px", 
                                height: "10px", 
                                alignItems: "center", 
                                textAlign: "right", 
                                display: "flex",
                                '& .MuiFilledInput-root': {
                                    backgroundColor: 'transparent',
                                    borderRadius: "0px",
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
                                    textAlign: 'right',
                                    padding: 0,
                                    pr: '4px',
                                    color: colors.surface,
                                    fontSize: "14px",
                                },
                                '& .Mui-focused' : {
                                    '& .MuiFilledInput-input': {
                                        backgroundColor: "#1C1B1FB2",
                                        textAlign: 'right',
                                        borderRadius: '5px 5px 0px 0px',
                                        borderBottom: 'none',
                                        // pr: '8px',
                                        pl: '2px',
                                    }
                                }
                            }}/>
                    </Stack>
                    <Slider
                        sx={{
                            width: "200px",
                            color: colors.surface,
                            '& .MuiSlider-rail': {
                                background: tintGradient,
                                opacity: 1,
                            },
                            '& .MuiSlider-track': {
                                background: 'transparent',
                                border: 'none',
                            }
                        }}
                        size="small"
                        value={props.TintScore}
                        step={1}
                        min={-100}
                        max={100}
                        onChange={(_event, newValue) => props.onTintChange(newValue as number)}
                    />
                </Stack>
                <Stack direction="column" gap="3px" sx={{pt: '10px', pb: '0px', px: '0px', mx: '0px'}}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{...typography.bodyMedium}}>Saturation</Typography>
                        <TextField
                            hiddenLabel
                            id="filled-hidden-label-small"
                            value={formatValue(props.SaturationScore)}
                            variant="filled"
                            onChange={(e) => handleInputChange(e, -100, 100, props.onSaturationChange)}
                            sx={{
                                    width: "40px", 
                                    height: "10px", 
                                    alignItems: "center", 
                                    textAlign: "right", 
                                    display: "flex",
                                    '& .MuiFilledInput-root': {
                                        backgroundColor: 'transparent',
                                        borderRadius: "0px",
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
                                        textAlign: 'right',
                                        padding: 0,
                                        pr: '4px',
                                        color: colors.surface,
                                        fontSize: "14px",
                                    },
                                    '& .Mui-focused' : {
                                        '& .MuiFilledInput-input': {
                                            backgroundColor: "#1C1B1FB2",
                                            textAlign: 'right',
                                            borderRadius: '5px 5px 0px 0px',
                                            borderBottom: 'none',
                                            // pr: '8px',
                                            pl: '2px',
                                        }
                                    }
                                }}/>
                    </Stack>
                    <Slider
                        sx={{
                            width: "200px",
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
                        value={props.SaturationScore}
                        step={1}
                        min={-100}
                        max={100}
                        onChange={(_event, newValue) => props.onSaturationChange(newValue as number)}
                    />
                </Stack>
            </Stack>
        </>
    )
}