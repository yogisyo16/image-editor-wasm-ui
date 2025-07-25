import React from "react";
import { 
    Box, 
    MenuItem, 
    FormControl, 
    Select, 
    Stack, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails, 
    CardMedia, 
    Typography,
    IconButton,
    Button,
    SelectChangeEvent
} from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";

// The props interface defines the contract with the parent page
interface Props {
    selectedPreset: string;
    expandedPanels: string[];
    presetMenuAnchorEl: null | HTMLElement;
    activePresetMenuId: string | null;
    isMenuOpen: boolean;
    onPanelChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    onSelectPreset: (event: SelectChangeEvent<string>) => void;
    onPresetMenuClick: (event: React.MouseEvent<HTMLElement>, presetId: string) => void;
    onPresetMenuClose: () => void;
    onRemovePreset: () => void;
    onRenamePreset: () => void;
    onDeletePreset: () => void;
    onOpenPresetModal: () => void;
}

const presets = [
    { id: 'preset1', name: 'My Preset 1' },
    { id: 'preset2', name: 'My Preset 2' },
    { id: 'preset3', name: 'My Preset 3' },
];

export default function HBulkPreset(props: Props) {
    const typography = useHonchoTypography();
    const colors = useColors();
    const isMenuOpen = Boolean(props.presetMenuAnchorEl);
    
    const isPanelExpanded = (panelName: string) => props.expandedPanels.includes(panelName);
    
    const accordionStyle = {
        backgroundColor: colors.onBackground,
        color: colors.surface,
        '& .MuiAccordionSummary-root': {
            backgroundColor: colors.onBackground,
            color: colors.surface,
        },
        '& .MuiAccordionDetails-root': {
            backgroundColor: colors.onBackground,
            color: colors.surface,
        },
        '& .MuiTypography-root': {
            color: colors.surface,
        },
        '& .MuiSvgIcon-root': {
            color: colors.surface,
        }
    };

    const CustomSelectIcon = (iconProps: { className?: string }) => {
        const isExpanded = iconProps.className?.includes('MuiSelect-iconOpen');
        return (
            <CardMedia
                component="img"
                image={isExpanded ? "/v1/svg/expand-editor.svg" : "/v1/svg/expanded-editor.svg"}
                sx={{ width: "11.67px", height: "5.83px", right: '14px', position: 'absolute', pointerEvents: 'none' }}
            />
        );
    };

    return (
        <>
            <Stack>
                <Accordion
                    sx={accordionStyle}
                    expanded={isPanelExpanded('preset')}
                    onChange={props.onPanelChange('preset')}
                    disableGutters
                >
                    <AccordionSummary>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                            <Typography sx={{ ...typography.titleMedium, color: colors.surface }}>Preset</Typography>
                            <CardMedia
                                component="img"
                                image={isPanelExpanded('preset') ? "/v1/svg/expanded-editor.svg" : "/v1/svg/expand-editor.svg"}
                                sx={{ width: "11.67px", height: "5.83px" }}
                            />
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl fullWidth>
                            <Select
                                fullWidth
                                value={props.selectedPreset}
                                onChange={props.onSelectPreset}
                                IconComponent={CustomSelectIcon}
                                renderValue={(selectedId) => {
                                    const selectedPresetObject = presets.find(p => p.id === selectedId);
                                    if (!selectedPresetObject) {
                                        return <Typography sx={{ ...typography.bodyMedium }}>Select</Typography>;
                                    }
                                    return <Typography sx={{ ...typography.bodyMedium }}>{selectedPresetObject.name}</Typography>;
                                }}
                                MenuProps={{
                                    slotProps: {
                                        paper: {
                                            sx: {
                                                backgroundColor: colors.onBackground,
                                                color: colors.surface,
                                                border: `1px solid ${colors.onSurfaceVariant1}`,
                                                mt: '20px',
                                                width: '178px',
                                            }
                                        }
                                    }
                                }}
                                sx={{ border: `1px solid ${colors.outlineVariant}`, height: '44px', width: '178px'}}
                            >
                                {presets.map((preset) => (
                                    <MenuItem key={preset.id} value={preset.id} sx={{ borderRadius: '4px', py: '4px', my: '0px', px: '0px', mx: '0px'}}>
                                        <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{ width: '100%', py: '0px', px: '0px', mx: '0px', my: '4px'}}>
                                            <CardMedia
                                                component="img"
                                                image="v1/svg/check-ratio-editor.svg"
                                                sx={{ 
                                                    width: "20px", 
                                                    height: "20px",
                                                    mr: '-16px',
                                                    px: '0px',
                                                    visibility: props.selectedPreset === preset.id ? 'visible' : 'hidden' 
                                                }}
                                            />
                                            <Typography sx={{
                                                width: '24px',
                                                textWrap: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: 'block',
                                                color: colors.surface,
                                                pr: "82px",
                                                pl: "0px",
                                                ml: "0px",
                                                justifyContent: 'flex-start',
                                                ...typography.bodyMedium
                                            }}>{preset.name}</Typography>
                                            <IconButton 
                                                aria-label={`Options for ${preset.name}`} 
                                                onClick={(event) => props.onPresetMenuClick(event, preset.id)}
                                                sx={{ padding: "0px", margin: "0px", mr: "0px" }}
                                            >
                                                <CardMedia component="img" image="/v1/svg/dots-editor.svg" alt="Options" sx={{ width: '20px', height: '20px' }}/>
                                            </IconButton>
                                        </Stack>
                                    </MenuItem>
                                ))}
                                <Box sx={{ px: '16px', my: '8px'}}>
                                    <Button 
                                        fullWidth
                                        variant="outlined" 
                                        sx={{ ...typography.labelMedium, height: '40px', color: colors.onBackground, backgroundColor: colors.surface, borderRadius: '100px', borderColor: colors.surface, textTransform: 'none', '&:hover': { backgroundColor: '#e0e0e0', borderColor: colors.surface } }}
                                        onClick={props.onOpenPresetModal}
                                    >
                                        Create Preset
                                    </Button>
                                </Box>
                            </Select>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
            </Stack>
        </>
    )
}                                    