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

type CheckState = { [key: string]: boolean };

interface Props {
    // State for each category's checkboxes
    colorChecks: CheckState;
    lightChecks: CheckState;
    detailsChecks: CheckState;
    // State for accordion expansion
    expanded: { color: boolean; light: boolean; details: boolean; };
    // Handlers
    onCopyEdit: () => void;
    onParentChange: (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<any>>) => void;
    onChildChange: (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<any>>) => void;
    onToggleExpand: (section: 'color' | 'light' | 'details') => void;
    // Setters passed directly for children to update state in the hook
    setColorChecks: React.Dispatch<React.SetStateAction<any>>;
    setLightChecks: React.Dispatch<React.SetStateAction<any>>;
    setDetailsChecks: React.Dispatch<React.SetStateAction<any>>;
}

export function HDialogCopy(props: Props) {
    const colors = useColors();
    const typography = useHonchoTypography();
    // --- Derived state is now calculated from props ---
    const colorValues = Object.values(props.colorChecks);
    const colorCheckedCount = colorValues.filter(Boolean).length;
    const isColorParentChecked = colorCheckedCount === colorValues.length;
    const isColorParentIndeterminate = colorCheckedCount > 0 && !isColorParentChecked;

    const lightValues = Object.values(props.lightChecks);
    const lightCheckedCount = lightValues.filter(Boolean).length;
    const isLightParentChecked = lightCheckedCount === lightValues.length;
    const isLightParentIndeterminate = lightCheckedCount > 0 && !isLightParentChecked;
    
    const detailsValues = Object.values(props.detailsChecks);
    const detailsCheckedCount = detailsValues.filter(Boolean).length;
    const isDetailsParentChecked = detailsCheckedCount === detailsValues.length;
    const isDetailsParentIndeterminate = detailsCheckedCount > 0 && !isDetailsParentChecked;

    const checkboxStyle = {
        color: colors.onSurfaceVariant,
        '&.Mui-checked, &.Mui-indeterminate': { color: colors.onSurface },
    };

    return (
        <Stack direction="column" spacing={1} sx={{ padding: 0, margin: 0, width: '100%' }}>
            <Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <FormControlLabel
                        label="Color Adjustments"
                        control={ <Checkbox color="default" checked={isColorParentChecked} indeterminate={isColorParentIndeterminate} onChange={(e) => props.onParentChange(e, props.setColorChecks)} sx={checkboxStyle} /> }
                    />
                    <Stack direction="row" alignItems="center">
                        <Typography sx={{ ...typography.labelMedium, color: colors.onSurface }}>{`${colorCheckedCount}/${colorValues.length}`}</Typography>
                        <IconButton onClick={() => props.onToggleExpand('color')} size="small">
                            <ExpandMoreIcon sx={{ transition: 'transform 0.3s', transform: props.expanded.color ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </IconButton>
                    </Stack>
                </Stack>
                <Collapse in={props.expanded.color} timeout="auto" unmountOnExit>
                    <Stack direction="column" sx={{ ml: 2, pl: 1.5, borderLeft: `1px solid ${colors.outlineVariant}` }}>
                        <FormControlLabel label="Temperature" control={<Checkbox color="default" name="temperature" checked={props.colorChecks.temperature} onChange={(e) => props.onChildChange(e, props.setColorChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Tint" control={<Checkbox color="default" name="tint" checked={props.colorChecks.tint} onChange={(e) => props.onChildChange(e, props.setColorChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Vibrance" control={<Checkbox color="default" name="vibrance" checked={props.colorChecks.vibrance} onChange={(e) => props.onChildChange(e, props.setColorChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Saturation" control={<Checkbox color="default" name="saturation" checked={props.colorChecks.saturation} onChange={(e) => props.onChildChange(e, props.setColorChecks)} sx={checkboxStyle} />} />
                    </Stack>
                </Collapse>
            </Stack>
            <Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                     <FormControlLabel label="Light Adjustments" control={ <Checkbox color="default" checked={isLightParentChecked} indeterminate={isLightParentIndeterminate} onChange={(e) => props.onParentChange(e, props.setLightChecks)} sx={checkboxStyle} /> } />
                     <Stack direction="row" alignItems="center">
                        <Typography sx={{ ...typography.labelMedium, color: colors.onSurface }}>{`${lightCheckedCount}/${lightValues.length}`}</Typography>
                        <IconButton onClick={() => props.onToggleExpand('light')} size="small">
                             <ExpandMoreIcon sx={{ transition: 'transform 0.3s', transform: props.expanded.light ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </IconButton>
                    </Stack>
                </Stack>
                 <Collapse in={props.expanded.light} timeout="auto" unmountOnExit>
                    <Stack direction="column" sx={{ ml: 2, pl: 1.5, borderLeft: `1px solid ${colors.outlineVariant}` }}>
                        <FormControlLabel label="Exposure" control={<Checkbox color="default" name="exposure" checked={props.lightChecks.exposure} onChange={(e) => props.onChildChange(e, props.setLightChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Contrast" control={<Checkbox color="default" name="contrast" checked={props.lightChecks.contrast} onChange={(e) => props.onChildChange(e, props.setLightChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Highlights" control={<Checkbox color="default" name="highlights" checked={props.lightChecks.highlights} onChange={(e) => props.onChildChange(e, props.setLightChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Shadows" control={<Checkbox color="default" name="shadows" checked={props.lightChecks.shadows} onChange={(e) => props.onChildChange(e, props.setLightChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Whites" control={<Checkbox color="default" name="whites" checked={props.lightChecks.whites} onChange={(e) => props.onChildChange(e, props.setLightChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Blacks" control={<Checkbox color="default" name="blacks" checked={props.lightChecks.blacks} onChange={(e) => props.onChildChange(e, props.setLightChecks)} sx={checkboxStyle} />} />
                    </Stack>
                </Collapse>
            </Stack>
            <Stack>
                 <Stack direction="row" alignItems="center" justifyContent="space-between">
                     <FormControlLabel label="Details Adjustments" control={ <Checkbox color="default" checked={isDetailsParentChecked} indeterminate={isDetailsParentIndeterminate} onChange={(e) => props.onParentChange(e, props.setDetailsChecks)} sx={checkboxStyle} /> }/>
                     <Stack direction="row" alignItems="center">
                        <Typography sx={{ ...typography.labelMedium, color: colors.onSurface }}>{`${detailsCheckedCount}/${detailsValues.length}`}</Typography>
                        <IconButton onClick={() => props.onToggleExpand('details')} size="small">
                           <ExpandMoreIcon sx={{ transition: 'transform 0.3s', transform: props.expanded.details ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </IconButton>
                    </Stack>
                </Stack>
                <Collapse in={props.expanded.details} timeout="auto" unmountOnExit>
                    <Stack direction="column" sx={{ ml: 2, pl: 1.5, borderLeft: `1px solid ${colors.outlineVariant}` }}>
                        <FormControlLabel label="Clarity" control={<Checkbox color="default" name="clarity" checked={props.detailsChecks.clarity} onChange={(e) => props.onChildChange(e, props.setDetailsChecks)} sx={checkboxStyle} />} />
                        <FormControlLabel label="Sharpness" control={<Checkbox color="default" name="sharpness" checked={props.detailsChecks.sharpness} onChange={(e) => props.onChildChange(e, props.setDetailsChecks)} sx={checkboxStyle} />} />
                    </Stack>
                </Collapse>
            </Stack>

            <Button onClick={props.onCopyEdit} sx={{...typography.labelMedium, mt: 2, color: colors.surface, backgroundColor: colors.onSurface}}>
                Copy
            </Button>
        </Stack>
    );
}