import React, { useState, useEffect } from "react";
import {
    Button,
    Stack,
    Typography,
    Checkbox,
    Collapse,
    FormControlLabel,
    IconButton
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useColors from "@/colors";
import useHonchoTypography from "@/honchoTheme";

interface Props {
    colorAdjustments: boolean;
    lightAdjustments: boolean;
    detailsAdjustments: boolean;
    // tempScore: number;
    // tintScore: number;
    // exposureScore: number;
    // highlightsScore: number;
    // shadowScore: number;
    // whiteScore: number;
    // blackScore: number;
    // saturationScore: number;
    // contrastScore: number;
    // clarityScore: number;
    // sharpnessScore: number;
    onCopyEdit: () => void;
    // onColorAdjustmentsChange: (value: boolean) => void;
}

export function HDialogCopy(props: Props) {
    const colors = useColors();
    const typography = useHonchoTypography();

    // --- 1. Create Separate State for Each Category ---
    const [colorChecks, setColorChecks] = useState({
        temperature: true, tint: true, vibrance: true, saturation: true
    });
    const [lightChecks, setLightChecks] = useState({
        exposure: true, contrast: true, highlights: true, shadows: true, whites: true, blacks: true
    });
    const [detailsChecks, setDetailsChecks] = useState({
        clarity: true, sharpness: true
    });

    const [expanded, setExpanded] = useState({
        color: true,
        light: true,
        details: true,
    });

    // --- 2. Create Handlers for Parent and Child Checkboxes ---

    // Parent handler: checks or unchecks all children in a group
    const handleParentChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<any>>
    ) => {
        const isChecked = event.target.checked;
        setter((prev: any) => {
            const newState: any = {};
            Object.keys(prev).forEach(key => { newState[key] = isChecked; });
            return newState;
        });
    };
    
    // Child handler: updates a single checkbox in a group
    const handleChildChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<any>>
    ) => {
        setter((prev: any) => ({
            ...prev,
            [event.target.name]: event.target.checked,
        }));
    };

    const handleToggleExpand = (section: 'color' | 'light' | 'details') => {
        setExpanded(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // --- 3. Calculate Derived State for each Parent Checkbox ---

    // Color Category
    const colorValues = Object.values(colorChecks);
    const colorCheckedCount = colorValues.filter(Boolean).length;
    const isColorParentChecked = colorCheckedCount === colorValues.length;
    const isColorParentIndeterminate = colorCheckedCount > 0 && !isColorParentChecked;

    // Light Category
    const lightValues = Object.values(lightChecks);
    const lightCheckedCount = lightValues.filter(Boolean).length;
    const isLightParentChecked = lightCheckedCount === lightValues.length;
    const isLightParentIndeterminate = lightCheckedCount > 0 && !isLightParentChecked;

    // Details Category
    const detailsValues = Object.values(detailsChecks);
    const detailsCheckedCount = detailsValues.filter(Boolean).length;
    const isDetailsParentChecked = detailsCheckedCount === detailsValues.length;
    const isDetailsParentIndeterminate = detailsCheckedCount > 0 && !isDetailsParentChecked;

    const checkboxStyle = {
        color: colors.onSurfaceVariant,
        '&.Mui-checked, &.Mui-indeterminate': {
            color: colors.onSurface,
        },
    };

    return (
        <Stack direction="column" spacing={"6px"} sx={{ padding: 0, margin: 0, width: '100%' }}>
            {/* --- Color Adjustments Section --- */}
            <Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <FormControlLabel
                        label="Color Adjustments"
                        control={
                            <Checkbox
                                color="default"
                                checked={isColorParentChecked}
                                indeterminate={isColorParentIndeterminate}
                                onChange={(e) => handleParentChange(e, setColorChecks)}
                                sx={checkboxStyle}
                            />
                        }
                    />
                    <Stack direction="row" alignItems="center">
                        <Typography sx={{ ...typography.labelMedium, color: colors.onSurface }}>
                            {`${colorCheckedCount}/${colorValues.length}`}
                        </Typography>
                        <IconButton onClick={() => handleToggleExpand('color')} size="small">
                            <ExpandMoreIcon sx={{ transition: 'transform 0.3s', transform: expanded.color ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </IconButton>
                    </Stack>
                </Stack>
                <Collapse in={expanded.color} timeout="auto" unmountOnExit>
                    <Stack direction="column" sx={{ ml: 2 }}>
                        <FormControlLabel label="Temperature" control={<Checkbox color="default" name="temperature" checked={colorChecks.temperature} onChange={(e) => handleChildChange(e, setColorChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Tint" control={<Checkbox color="default" name="tint" checked={colorChecks.tint} onChange={(e) => handleChildChange(e, setColorChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Vibrance" control={<Checkbox color="default" name="vibrance" checked={colorChecks.vibrance} onChange={(e) => handleChildChange(e, setColorChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Saturation" control={<Checkbox color="default" name="saturation" checked={colorChecks.saturation} onChange={(e) => handleChildChange(e, setColorChecks)} sx={checkboxStyle} />} />
                    </Stack>
                </Collapse>
            </Stack>

            {/* --- Light Adjustments Section --- */}
            <Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <FormControlLabel
                        label="Light Adjustments"
                        control={
                            <Checkbox
                                color="default"
                                checked={isLightParentChecked}
                                indeterminate={isLightParentIndeterminate}
                                onChange={(e) => handleParentChange(e, setLightChecks)}
                                sx={checkboxStyle}
                            />
                        }
                    />
                    <Stack direction="row" alignItems="center">
                        <Typography sx={{ ...typography.labelMedium, color: colors.onSurface }}>
                            {`${lightCheckedCount}/${lightValues.length}`}
                        </Typography>
                        <IconButton onClick={() => handleToggleExpand('light')} size="small">
                            <ExpandMoreIcon sx={{ transition: 'transform 0.3s', transform: expanded.color ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </IconButton>
                    </Stack>
                </Stack>
                <Collapse in={expanded.light} timeout="auto" unmountOnExit>
                    <Stack direction="column" sx={{ ml: 2 }}>
                        <FormControlLabel label="Exposure" control={<Checkbox color="default" name="exposure" checked={lightChecks.exposure} onChange={(e) => handleChildChange(e, setLightChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Contrast" control={<Checkbox color="default" name="contrast" checked={lightChecks.contrast} onChange={(e) => handleChildChange(e, setLightChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Highlights" control={<Checkbox color="default" name="highlights" checked={lightChecks.highlights} onChange={(e) => handleChildChange(e, setLightChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Shadows" control={<Checkbox color="default" name="shadows" checked={lightChecks.shadows} onChange={(e) => handleChildChange(e, setLightChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Whites" control={<Checkbox color="default" name="whites" checked={lightChecks.whites} onChange={(e) => handleChildChange(e, setLightChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Blacks" control={<Checkbox color="default" name="blacks" checked={lightChecks.blacks} onChange={(e) => handleChildChange(e, setLightChecks)} sx={checkboxStyle} />} />
                    </Stack>
                </Collapse>
            </Stack>

            {/* --- Details Adjustments Section --- */}
            <Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                     <FormControlLabel
                        label="Details Adjustments"
                        control={
                            <Checkbox
                                color="default"
                                checked={isDetailsParentChecked}
                                indeterminate={isDetailsParentIndeterminate}
                                onChange={(e) => handleParentChange(e, setDetailsChecks)}
                                sx={checkboxStyle}
                            />
                        }
                    />
                    <Stack direction="row" alignItems="center">
                        <Typography sx={{ ...typography.labelMedium, color: colors.onSurface }}>
                            {`${detailsCheckedCount}/${detailsValues.length}`}
                        </Typography>
                        <IconButton onClick={() => handleToggleExpand('details')} size="small">
                            <ExpandMoreIcon sx={{ transition: 'transform 0.3s', transform: expanded.color ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </IconButton>
                    </Stack>
                </Stack>
                <Collapse in={expanded.details} timeout="auto" unmountOnExit>
                    <Stack direction="column" sx={{ ml: 2 }}>
                        <FormControlLabel label="Clarity" control={<Checkbox color="default" name="clarity" checked={detailsChecks.clarity} onChange={(e) => handleChildChange(e, setDetailsChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Sharpness" control={<Checkbox color="default" name="sharpness" checked={detailsChecks.sharpness} onChange={(e) => handleChildChange(e, setDetailsChecks)} sx={checkboxStyle} />} />
                    </Stack>
                </Collapse>
            </Stack>
            <Stack sx={{ p: '0px', pt: '5px', pb: '5px', m: '0px' }}>
                <Button onClick={props.onCopyEdit} sx={{...typography.labelMedium, pt: '10px', pb: '10px', color: colors.surface, backgroundColor: colors.onSurface, borderRadius: '100px'}}>
                    Copy
                </Button>
            </Stack>
        </Stack>
    );
}