import React from "react";
import {
    Button,
    Stack,
    Typography,
    Checkbox,
    FormControlLabel, FormControl, FormLabel, FormHelperText,
} from "@mui/material";
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

    // Later move into main logic state
    const [checked, setChecked] = React.useState([true, false]);

    // Checkbox change handlers
    // Color Adjustments
    const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([event.target.checked, checked[1]]);
    };

    const handleChangeTemperature = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };

    const handleChangeTint = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([event.target.checked, checked[1]]);
    };

    const handleChangeVibrance = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };

    const handleChangeSaturation = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([event.target.checked, checked[1]]);
    };

    // Light Adjustments
    const handleChangeLight = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };

    const handleChangeExposure = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };

    const handleChangeContrast = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };

    const handleChangeHighlights = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };

    const handleChangeShadows = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };

    const handleChangeWhites = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };

    const handleChangeBlacks = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };


    // Details Adjustments
    const handleChangeDetails = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([event.target.checked, event.target.checked]);
    };

    const handleChangeClarity = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([event.target.checked, checked[1]]);
    };

    const handleChangeSharpness = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };

    const checkboxStyle = {
        color: colors.onSurface,
        '&.Mui-checked, &.Mui-indeterminate': {
            color: colors.onSurface,
        },
    };

    // Control for childer checkbox
    const colorChildren = (
        <>
            <Stack direction="column" sx={{ ml: 2 }}>
                <FormControlLabel
                    label="Temperature"
                    control={<Checkbox color="default" checked={checked[0]} onChange={handleChangeTemperature} sx={checkboxStyle} />}
                />
                <FormControlLabel
                    label="Tint"
                    control={<Checkbox color="default" checked={checked[1]} onChange={handleChangeTint} sx={checkboxStyle} />}
                />
                <FormControlLabel
                    label="Vibrance"
                    control={<Checkbox color="default" checked={checked[1]} onChange={handleChangeVibrance} sx={checkboxStyle} />}
                />
                <FormControlLabel
                    label="Saturation"
                    control={<Checkbox color="default" checked={checked[1]} onChange={handleChangeSaturation} sx={checkboxStyle} />}
                />
            </Stack>
        </>
    );

    const lightChildren = (
        <>
            <Stack direction="column" sx={{ ml: 2 }}>
                <FormControlLabel
                    label="Exposure"
                    control={<Checkbox color="default" checked={checked[0]} onChange={handleChangeExposure} sx={checkboxStyle} />}
                />
                <FormControlLabel
                    label="Contrast"
                    control={<Checkbox color="default" checked={checked[0]} onChange={handleChangeContrast} sx={checkboxStyle} />}
                />
                <FormControlLabel
                    label="Highlights"
                    control={<Checkbox color="default" checked={checked[0]} onChange={handleChangeHighlights} sx={checkboxStyle} />}
                />
                <FormControlLabel
                    label="Shadows"
                    control={<Checkbox color="default" checked={checked[0]} onChange={handleChangeShadows} sx={checkboxStyle} />}
                />
                <FormControlLabel
                    label="Whites"
                    control={<Checkbox color="default" checked={checked[0]} onChange={handleChangeWhites} sx={checkboxStyle} />}
                />
                <FormControlLabel
                    label="Blacks"
                    control={<Checkbox color="default" checked={checked[0]} onChange={handleChangeBlacks} sx={checkboxStyle} />}
                />
            </Stack>
        </>
    );

    const detailsChildren = (
        <>
            <Stack direction="column" sx={{ ml: 2 }}>
                <FormControlLabel
                    label="Vibrance"
                    control={<Checkbox color="default" checked={checked[0]} onChange={handleChangeClarity} sx={checkboxStyle} />}
                />
                <FormControlLabel
                    label="Saturation"
                    control={<Checkbox color="default" checked={checked[1]} onChange={handleChangeSharpness} sx={checkboxStyle} />}
                />
            </Stack>
        </>
    );

    return (
        <>
            <Stack direction="column">
                <Stack>
                    <FormControlLabel
                        label="Color Adjustments"
                        control={
                            <Checkbox
                                color="default"
                                checked={checked[0] && checked[1]}
                                indeterminate={checked[0] !== checked[1]}
                                onChange={handleChangeColor}
                                sx={checkboxStyle}
                            />
                        }
                    />
                    {colorChildren}
                </Stack>
                <Stack>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <FormControlLabel
                            label="Light Adjustments"
                            control={
                                <Checkbox
                                    color="default"
                                    checked={checked[0] && checked[1]}
                                    indeterminate={checked[0] !== checked[1]}
                                    onChange={handleChangeLight}
                                    sx={checkboxStyle}
                                />
                            }
                        />

                        <Typography sx={{ ...typography.labelMedium, color: colors.onSurface }}>
                            1/2
                        </Typography>
                    </Stack>
                    {lightChildren}
                </Stack>
                <Stack>
                    <FormControlLabel
                        label="Details Adjustments"
                        control={
                            <Checkbox
                                color="default"
                                checked={checked[0] && checked[1]}
                                indeterminate={checked[0] !== checked[1]}
                                onChange={handleChangeDetails}
                                sx={checkboxStyle}
                            />
                        }
                    />
                    {detailsChildren}
                </Stack>
                <Button onClick={props.onCopyEdit} sx={{...typography.labelMedium, color: colors.surface, backgroundColor: colors.onSurface}}>
                    Copy
                </Button>
            </Stack>
        </>
    );
}