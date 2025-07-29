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
import {CloseOutlined} from "@mui/icons-material";

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

    return (
        <>
            <Stack direction="column">
                <Stack>
                    <FormControlLabel
                        label="Color Adjustments"
                        control={
                            <Checkbox
                                checked={props.colorAdjustments}
                                indeterminate={props.colorAdjustments === null}
                                // onChange={(e) => props.onColorAdjustmentsChange(e.target.checked)}
                            />
                        }
                    />
                </Stack>
                <Stack>
                    <FormControlLabel
                        label="Light Adjustments"
                        control={
                            <Checkbox
                                checked={props.lightAdjustments}
                                indeterminate={props.lightAdjustments === null}
                                // onChange={(e) => props.onLightAdjustmentsChange(e.target.checked)}
                            />
                        }
                    />
                </Stack>
                <Stack>
                    <FormControlLabel
                        label="Details Adjustments"
                        control={
                            <Checkbox
                                checked={props.detailsAdjustments}
                                indeterminate={props.detailsAdjustments === null}
                                // onChange={(e) => props.onDetailsAdjustmentsChange(e.target.checked)}
                            />
                        }
                    />
                </Stack>
                <Button onClick={props.onCopyEdit} variant="contained" color="primary">
                    Copy
                </Button>
            </Stack>
        </>
    );
}