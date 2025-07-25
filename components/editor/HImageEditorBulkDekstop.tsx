import React from "react";
import { Button, Stack, IconButton, CardMedia, MenuItem, ListItemText, Menu, ListItemIcon, Paper, Slide } from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";

interface Props {
    activePanel: string;
    isPanelOpen: boolean;
    anchorElZoom: null | HTMLElement;
    children: React.ReactNode;
    footer: React.ReactNode;
    setActivePanel: (accordion: string) => void;
    onScale: (event: React.MouseEvent<HTMLElement>) => void;
    onBeforeAfter: () => void;
    onZoomMenuClose: () => void;
    onZoomAction: (zoomLevel: string) => void;
}

export default function HImageEditorBulkDekstop(props: Props) {
    const typography = useHonchoTypography();
    const colors = useColors();
    const isZoomMenuOpen = Boolean(props.anchorElZoom);

    return (
        <>
            <Slide direction="left" in={props.isPanelOpen} mountOnEnter unmountOnExit>
                <Paper
                    elevation={3}
                    sx={{
                        position: 'inherit',
                        right: '30px',
                        top: '55px',
                        width: '320px',
                        height: 'calc(100vh - 100px)',
                        zIndex: 1200,
                        backgroundColor: '#000000',
                        overflow: 'hidden'
                    }}
                >
                    <Stack direction="row" sx={{ height: '100%' }}>
                        <Stack direction="column" sx={{ width: 'calc(100% - 60px)', height: '95%' }}>
                            <Stack sx={{ flexGrow: 1, overflowY: 'auto', px: 2, msOverflowStyle: 'none', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                                {props.children}
                            </Stack>
                            <Stack sx={{
                                flexShrink: 0,
                                p: '0px 16px',
                            }}>
                                {props.footer}
                            </Stack>
                        </Stack>
                        <Stack
                            justifyContent="flex-start"
                            spacing={"15px"}
                            sx={{
                                width: '10px',
                                flexShrink: 0,
                                pt: 1,
                            }}
                        >
                            <IconButton onClick={() => props.setActivePanel('colorAdjustment')}>
                                <CardMedia
                                    component="img"
                                    image={props.activePanel === 'colorAdjustment' ? "/v1/svg/color-adjustment-active.svg" : "/v1/svg/color-adjustment-inactive.svg"}
                                    sx={{ width: "20px", height: "20px" }}
                                />
                            </IconButton>
                            <IconButton onClick={() => props.setActivePanel('aspectRatio')}>
                                <CardMedia
                                    component="img"
                                    image={props.activePanel === 'aspectRatio' ? "/v1/svg/crop-editor-active.svg" : "/v1/svg/crop-editor-inactive.svg"}
                                    sx={{ width: "20px", height: "20px" }}
                                />
                            </IconButton>
                            <IconButton onClick={() => props.setActivePanel('preset')}>
                                <CardMedia
                                    component="img"
                                    image={props.activePanel === 'preset' ? "/v1/svg/watermark-editor-active.svg" : "/v1/svg/watermark-editor-inactive.svg"}
                                    sx={{ width: "20px", height: "20px" }}
                                />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Paper>
            </Slide>
        </>
    );
}