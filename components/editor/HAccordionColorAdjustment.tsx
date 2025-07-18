import React from "react";
import { Accordion, AccordionDetails , AccordionSummary, CardMedia, Stack, Typography } from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import HAccordionColor from "./HAccordionColor";
import HAccordionLight from "./HAccordionLight";
import HAccordionPresence from "./HAccordionPresence";
import HAccordionDetails from "./HAccordionDetails";
import useColors from "@/colors";

interface Props {
    // Getters get values
    tempScore: number;
    tintScore: number;
    exposureScore: number;
    HighlightsScore: number;
    shadowsScore: number;
    whitesScore: number;
    blacksScore: number;
    contrastScore: number;
    clarityScore: number;
    sharpnessScore: number;
    saturationScore: number;
    expandedPanels: string[];
    // Setters get values update
    setTempScore: (value: number) => void;
    setTintScore: (value: number) => void;
    setExposureScore: (value: number) => void;
    setHighlightsScore: (value: number) => void;
    setShadowsScore: (value: number) => void;
    setWhitesScore: (value: number) => void;
    setBlacksScore: (value: number) => void;
    setContrastScore: (value: number) => void;
    setClarityScore: (value: number) => void;
    setSharpnessScore: (value: number) => void;
    setSaturationScore: (value: number) => void;
    onPanelChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

export default function HAccordionColorAdjustment(props: Props) {
    const typography = useHonchoTypography();
    const colors = useColors();

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

    const isPanelExpanded = (panelName: string) => props.expandedPanels.includes(panelName);

    return (
        <>
            <Stack direction="column" sx={{ accordionStyle }}>
                <Accordion
                    sx={accordionStyle}
                    expanded={isPanelExpanded('whiteBalance')}
                    onChange={props.onPanelChange('whiteBalance')}
                    disableGutters
                >
                    <AccordionSummary>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                            <Typography sx={{ ...typography.titleMedium }}>Color</Typography>
                            <CardMedia
                                component="img"
                                image={isPanelExpanded('whiteBalance') ? "/v1/svg/expanded-editor.svg" : "/v1/svg/expand-editor.svg"}
                                sx={{ width: "11.67px", height: "5.83px" }}
                            />
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <HAccordionColor
                            TempScore = {props.tempScore}
                            TintScore = {props.tintScore}
                            onTempChange={props.setTempScore}
                            onTintChange={props.setTintScore}
                            SaturationScore={props.saturationScore}
                            onSaturationChange={props.setSaturationScore}
                        />
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    sx={accordionStyle}
                    expanded={isPanelExpanded('light')}
                    onChange={props.onPanelChange('light')}
                    disableGutters
                >
                    <AccordionSummary>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                            <Typography sx={{ ...typography.titleMedium }}>Light</Typography>
                            <CardMedia
                                component="img"
                                image={isPanelExpanded('light') ? "/v1/svg/expanded-editor.svg" : "/v1/svg/expand-editor.svg"}
                                sx={{ width: "11.67px", height: "5.83px" }}
                            />
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <HAccordionLight
                            ExposureScore = {props.exposureScore}
                            ContrastScore = {props.contrastScore}
                            HighlightsScore = {props.HighlightsScore}
                            ShadowsScore = {props.shadowsScore}
                            WhitesScore = {props.whitesScore}
                            BlacksScore = {props.blacksScore}
                            onExposureChange={props.setExposureScore}
                            onContrastChange={props.setContrastScore}
                            onHighlightsChange={props.setHighlightsScore}
                            onShadowsChange={props.setShadowsScore}
                            onWhitesChange={props.setWhitesScore}
                            onBlacksChange={props.setBlacksScore}
                        />
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    sx={accordionStyle}
                    expanded={isPanelExpanded('details')}
                    onChange={props.onPanelChange('details')}
                    disableGutters
                >
                    <AccordionSummary>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                            <Typography sx={{ ...typography.titleMedium }}>Details</Typography>
                            <CardMedia
                                component="img"
                                image={isPanelExpanded('details') ? "/v1/svg/expanded-editor.svg" : "/v1/svg/expand-editor.svg"}
                                sx={{ width: "11.67px", height: "5.83px" }}
                            />
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <HAccordionDetails
                            // ContrastScore = {props.contrastScore}
                            ClarityScore = {props.clarityScore}
                            SharpnessScore = {props.sharpnessScore}
                            // onContrastChange={props.setContrastScore}
                            onClarityChange={props.setClarityScore}
                            onSharpnessChange={props.setSharpnessScore}
                        />
                    </AccordionDetails>
                </Accordion>
            </Stack>
        </>
    )
}
