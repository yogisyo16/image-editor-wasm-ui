import React from "react";
import {Typography, Stack, IconButton, CardMedia, Button} from "@mui/material";
import useColors from "@/colors";
import useHonchoTypography from "@/honchoTheme";

interface Props {
    onOpenPresetModal: () => void;
    selectedPreset: string | null;
    onSelectPreset: (id: string) => void;
    // For myPreset or preset name will hit API
}

const presets = [
    { id: 'preset1', name: 'My Preset 1' },
    { id: 'preset2', name: 'My Preset 2' },
    { id: 'preset3', name: 'My Preset 3' },
];

export default function HTabPresetMobile (props: Props){
    const typography = useHonchoTypography();
    const colors = useColors();

    return(
        <>
            <Stack direction="column" spacing={0} sx={{ px: "0px", mx: "0px" }}>
                {presets.map((preset) => (
                    <Stack key={preset.id} direction="row" alignItems="center" justifyContent="space-between">
                        <Button
                            sx={{ ...typography.bodyMedium, color: colors.surface, justifyContent: 'flex-start', flexGrow: 1 }}
                            onClick={() => props.onSelectPreset(preset.id)}
                        >
                            {preset.name}
                        </Button>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {props.selectedPreset === preset.id && (
                                <CardMedia
                                    component="img"
                                    image="v1/svg/check-ratio-editor.svg"
                                    sx={{ width: "20px", height: "20px", px: "2px" }}
                                />
                            )}
                            <IconButton aria-label={preset.name} sx={{ px: "8px" }}>
                                <CardMedia
                                    component="img"
                                    image="/v1/svg/dots-editor.svg"
                                    alt="Options"
                                />
                            </IconButton>
                        </Stack>
                    </Stack>
                ))}
                <Button 
                    variant="text" 
                    sx={{ color: colors.surface, border: "1px solid" ,borderColor: colors.surface, borderRadius: "40px", mt: "12px" }}
                    onClick={props.onOpenPresetModal}
                >
                    Create Preset
                </Button>
            </Stack>
        </>
    )
}