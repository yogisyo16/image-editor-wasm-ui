import React from "react";
import { Button, Stack, Slider, Typography, TextField } from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";

interface Props {
    ClarityScore: number;
    SharpnessScore: number;
    onClarityChange: (value: number) => void;
    onSharpnessChange: (value: number) => void;
}

export default function HAccordionDetails(props: Props) {
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
    
    return(
        <>
            <Stack>
                <Stack direction="column" gap="4px" sx={{pt: '6px', pb: '2px', px: '0px', mx: '0px'}}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{...typography.bodyMedium}}>Clarity</Typography>
                        <TextField
                            hiddenLabel
                            id="filled-hidden-label-small"
                            value={formatValue(props.ClarityScore)}
                            variant="filled"
                            onChange={(e) => handleInputChange(e, -100, 100, props.onClarityChange)}
                            sx={{
                                width: "40px", 
                                height: "10px", 
                                alignItems: "center", 
                                textAlign: "right", 
                                display: "flex",
                                '& .MuiFilledInput-root': {
                                    // backgroundColor: 'transparent',
                                    // border: '',
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
                            color: colors.onSurfaceVariant,
                            '& .MuiSlider-rail': {
                                background: colors.onSurfaceVariant,
                                opacity: 1,
                            },
                            '& .MuiSlider-thumb': {
                                background: colors.surface,
                                opacity: 1,
                            },
                            '& .MuiSlider-thumb:hover': {
                                boxShadow: 'none',   
                            }
                        }}
                        size="small"
                        value={props.ClarityScore}
                        step={1}
                        min={-100}
                        max={100}
                        onChange={(_event, newValue) => props.onClarityChange(newValue as number)}
                    />
                </Stack>
                <Stack direction="column" gap="3px" sx={{pt: '10px', pb: '0px', px: '0px', mx: '0px'}}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{...typography.bodyMedium}}>Sharpness</Typography>
                        <TextField
                            hiddenLabel
                            id="filled-hidden-label-small"
                            value={formatValue(props.SharpnessScore)}
                            variant="filled"
                            onChange={(e) => handleInputChange(e, -100, 100, props.onSharpnessChange)}
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
                            color: colors.onSurfaceVariant,
                            '& .MuiSlider-rail': {
                                background: colors.onSurfaceVariant,
                                opacity: 1,
                            },
                            '& .MuiSlider-thumb': {
                                background: colors.surface,
                                opacity: 1,
                            },
                            '& .MuiSlider-thumb:hover': {
                                boxShadow: 'none',   
                            }
                        }}
                        size="small"
                        value={props.SharpnessScore}
                        step={1}
                        min={-100}
                        max={100}
                        onChange={(_event, newValue) => props.onSharpnessChange(newValue as number)}
                    />
                </Stack>
            </Stack>
        </>
    )
}