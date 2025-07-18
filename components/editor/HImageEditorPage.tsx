import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Stack, SelectChangeEvent, Menu, MenuItem, ListItemText, CardMedia } from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";
import useIsMobile from "@/utils/isMobile";
import HHeaderEditor from "./HHeaderEditor";
import HAccordionColorAdjustment from "./HAccordionColorAdjustment";
// import HAccordionAspectRatio from "./HAccordionAspectRatio";
import { HBaseDialog } from "./HDialogBox";
import HAccordionPreset from "./HAccordionPreset";
import HImageEditorMobile from "./HImageEditorMobile";
import HImageEditorDesktop from "./HImageEditorDekstop";
import HImageEditorBulkDekstop from "./HImageEditorBulkDekstop";
import HImageEditorBulkMobile from "./HImageEditorBulkMobile";
import HBulkAccordionColorAdjustment from "./HBulkAccordionColorAdjustment";
import HBulkPreset from "./HBulkPreset";
import HModalEditorDekstop from "./HModalEditorDekstop";
import HFooter from "./HFooter";
import HTextField from "./HTextField";
import HWatermarkView from "./HWatermarkView";
import HModalMobile from "./HModalMobile";
import HAlertBox from "./HAlertBox";
import HPresetOptionsMenu from "./HPresetOptionMenu"; 

export default function HImageEditor() {
    // Basic const to be Used
    const typography = useHonchoTypography();
    const colors = useColors();
    // Mobile breakpoint
    const isMobile = useIsMobile();

    // For Internet connection
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    // UseEffect for internet connection
    useEffect(() => {
        // Event listener to update state when online
        const handleOnline = () => setIsOnline(true);
        // Event listener to update state when offline
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup listeners on component unmount
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // For Image Editor Header and Navbar
    // const [isPanelOpen, setIsPanelOpen] = useState(false);
    // const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [activePanel, setActivePanel] = useState('colorAdjustment');
    const [activeSubPanel, setActiveSubPanel] = useState('');
    const [headerMenuAnchorEl, setHeaderMenuAnchorEl] = useState<null | HTMLElement>(null);

    // State for Aspect Ratio
    const [currentAspectRatio, setCurrentAspectRatio] = useState('potrait');
    const [currentSquareRatio, setCurrentSquareRatio] = useState('original');
    const [currentWideRatio, setCurrentWideRatio] = useState('1:1');
    const [angelScore, setAngleScore] = useState(0);
    const [widthSizePX, setWidthSizePX] = useState(0);
    const [heightSizePX, setHeightSizePX] = useState(0);
    const [anchorMenuZoom, setAnchorMenuZoom] = useState<null | HTMLElement>(null);
    
    // State for color adjustment
    const [colorAdjustmentExpandedPanels, setColorAdjustmentExpandedPanels] = useState<string[]>(['whiteBalance']);
    // State for White Balance
    const [tempScore, setTempScore] = useState(0);
    const [tintScore, setTintScore] = useState(0);
    // State for Light adjustments
    const [exposureScore, setExposureScore] = useState(0);
    const [highlightsScore, setHighlightsScore] = useState(0);
    const [shadowsScore, setShadowsScore] = useState(0);
    const [whitesScore, setWhitesScore] = useState(0);
    const [blacksScore, setBlacksScore] = useState(0);
    // State for Presence
    const [saturationScore, setSaturationScore] = useState(0);
    // State for Details
    const [contrastScore, setContrastScore] = useState(0);
    const [clarityScore, setClarityScore] = useState(0);
    const [sharpnessScore, setSharpnessScore] = useState(0);

    // State for Preset and Watermark
    // State for Preset
    const [presetExpandedPanels, setPresetExpandedPanels] = useState<string[]>(['preset']);
    // State for modal preset
    const [isPresetModalOpen, setPresetModalOpen] = useState(false);
    const [isPresetModalOpenMobile, setPresetModalOpenMobile] = useState(false);
    const [presetName, setPresetName] = useState("Type Here");
    const [isPresetCreated, setIsPresetCreated] = useState(false);
    const [selectedMobilePreset, setSelectedMobilePreset] = useState<string | null>('preset1');
    const [selectedDesktopPreset, setSelectedDesktopPreset] = useState<string | null>('preset1');
    const [selectedBulkPreset, setSelectedBulkPreset] = useState<string>('preset1');
    const [presetMenuAnchorEl, setPresetMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [activePresetMenuId, setActivePresetMenuId] = useState<string | null>(null);
    // Watermark
    const [isCreatingWatermark, setIsCreatingWatermark] = useState(false);

    // Canvas dimensions
    const directionForEditor = isMobile ? "column" : "row";

    // State for bulkEditing
    const [isBulkEditing, setIsBulkEditing] = useState(false);
    const [selectedImages, setSelectedImages] = useState('Select');

    // State for mobile editor
    const panelPartialHeight = 165;
    const [contentHeight, setContentHeight] = useState(0);
    const [panelHeight, setPanelHeight] = useState(panelPartialHeight);
    // const [panelBottom, setPanelBottom] = useState(95);

    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef(0);
    const initialHeight = useRef(0);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    // Function for Header
    const handleHeaderMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setHeaderMenuAnchorEl(event.currentTarget);
    };

    const handleHeaderMenuClose = () => {
        setHeaderMenuAnchorEl(null);
    };

    // Function for Preset
    // Mobile
    const handleSelectMobilePreset = (presetId: string) => {
        setSelectedMobilePreset(presetId);
        console.log("Selected Mobile Preset from Page:", presetId);
    };
    
    // Desktop
    const handleSelectDesktopPreset = (presetId: string) => {
        setSelectedDesktopPreset(presetId);
        console.log("Selected Desktop Preset from Page:", presetId);
    };
    const handlePresetMenuClick = (event: React.MouseEvent<HTMLElement>, presetId: string) => {
        event.stopPropagation();
        setPresetMenuAnchorEl(event.currentTarget);
        setActivePresetMenuId(presetId);
    };

    const handlePresetMenuClose = () => {
        setPresetMenuAnchorEl(null);
        setActivePresetMenuId(null);
    };

    const handleRemovePreset = () => {
        console.log(`Remove action for preset: ${activePresetMenuId}`);
        handlePresetMenuClose();
    }

    const handleRenamePreset = () => {
        console.log(`Rename action for preset: ${activePresetMenuId}`);
        handlePresetMenuClose();
    };

    const handleDeletePreset = () => {
        console.log(`Delete action for preset: ${activePresetMenuId}`);
        handlePresetMenuClose();
    };

    // Mobile editor function
    useEffect(() => {
        // When the sub-panel changes, measure the content's height
        if (contentRef.current) {
            const height = contentRef.current.scrollHeight;
            if (height > 0 && height !== contentHeight) {
                setContentHeight(height);
            }
        }
    }, [activeSubPanel, contentHeight]);

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStartPos.current = startY;
        initialHeight.current = panelHeight;

        if (panelRef.current) {
            panelRef.current.classList.remove('MuiPaper-transition');
        }
    };

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const deltaY = dragStartPos.current - currentY;
        const newHeight = initialHeight.current + deltaY;

        const panelChromeHeight = 60;
        const dynamicPanelFullHeight = contentHeight + panelChromeHeight;
        
        const clampedHeight = Math.max(165, Math.min(newHeight, dynamicPanelFullHeight));
        setPanelHeight(clampedHeight);
    }, [isDragging, contentHeight]);

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        dragStartPos.current = 0;

        if (panelRef.current) {
            panelRef.current.classList.add('MuiPaper-transition');
        }

        const panelChromeHeight = 60;
        const dynamicPanelFullHeight = contentHeight + panelChromeHeight;

        const halfwayPoint = (dynamicPanelFullHeight + 165) / 2;
        if (panelHeight > halfwayPoint) {
            setPanelHeight(dynamicPanelFullHeight);
        } else {
            setPanelHeight(165);
        }
    }, [isDragging, panelHeight, contentHeight]);

    const handleContentHeightChange = useCallback((height: number) => {
        // Only update if the height is different to avoid extra re-renders
        if (height > 0 && height !== contentHeight) {
            setContentHeight(height);
        }
    }, [contentHeight]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove);
            window.addEventListener('touchend', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    // Functions modal
    const handleOpenPresetModal = () => {
        setIsPresetCreated(false);
        setPresetModalOpen(true);
    };
    const handleClosePresetModal = () => setPresetModalOpen(false);
    const handleCreatePreset = () => {
        console.log("Creating preset with name:", presetName);
        setIsPresetCreated(true);
        handleClosePresetModal();
        setTimeout(() => {
            setIsPresetCreated(false);
        }, 1000);
    };

    // Function modal mobile
    const handleOpenPresetModalMobile = () => {
        setIsPresetCreated(false);
        setPresetModalOpenMobile(true);
    };
    const handleClosePresetModalMobile = () => setPresetModalOpenMobile(false);

    const handleCreatePresetMobile = () => {
        console.log("Creating preset with name:", presetName);
        setIsPresetCreated(true);
        handleClosePresetModalMobile();
        setTimeout(() => {
            setIsPresetCreated(false);
        })
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPresetName(event.target.value);
    };

    // Functions for color adjustment
    const handleColorAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setColorAdjustmentExpandedPanels((prev) => {
            if (isExpanded) {
                return [...new Set([...prev, panel])];
            } else {
                return prev.filter((p) => p !== panel);
            }
        });
    };

    const handlePresetAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setPresetExpandedPanels((prev) => {
            if (isExpanded) {
                return [...new Set([...prev, panel])];
            } else {
                return prev.filter((p) => p !== panel);
            }
        });
    };

    const handleBack = () => {
        console.log("Back button clicked on main header!");
    };

    const handleUndo = () => {
        console.log("Undo button clicked!");
    }

    const handleRedo = () => {
        console.log("Redo button clicked!");
    }

    const handleRevert = () => {
        console.log("Revert button clicked!");
    }

    const handleCopyEdit = () => {
        console.log("Copy Edit button clicked!");
    }

    const handlePasteEdit = () => {
        console.log("Paste Edit button clicked!");
    }

    const handleAspectRatioSelect = (ratio: string) => {
        setCurrentAspectRatio(ratio);
        console.log(`Aspect ratio selected: ${ratio}`);
    };

    const handleScale = (event: React.MouseEvent<HTMLElement>) => {
        console.log("Scale button clicked, setting anchor.");
        setAnchorMenuZoom(event.currentTarget);
    };

    const handleZoomMenuClose = () => {
        setAnchorMenuZoom(null);
    };

    const handleZoomAction = (zoomLevel: string) => {
        console.log(`Zoom action selected: ${zoomLevel}`);
        handleZoomMenuClose();
    };

    const handleBeforeAfter = () => {
        console.log("Before/After button clicked!");
    };

    const handleOpenWatermarkView = () => {
        setIsCreatingWatermark(true);
    };

    const handleSaveWatermark = () => {
        console.log("Save action from watermark view.");
        setIsCreatingWatermark(false);
    };

    const handleCancelWatermark = () => {
        console.log("Cancel action from watermark view.");
        setIsCreatingWatermark(false);
    };

    // Bulk editing web and mobile
    const toggleBulkEditing = () => {
        setIsBulkEditing(prevIsBulkEditing => {
            const newIsBulkEditing = !prevIsBulkEditing;

            if (newIsBulkEditing) {
                console.log("Bulk editor ON");
                setSelectedImages('Selected');
            } else {
                console.log("Bulk editor OFF");
                setSelectedImages('Select');
            }

            return newIsBulkEditing;
        });
    };

    const handleSelectBulkPreset = (event: SelectChangeEvent<string>) => {
        setSelectedBulkPreset(event.target.value as string);
        console.log("Selected Bulk Preset from Page:", event.target.value);
    };

    const renderActivePanelBulk = () => {
        switch (activePanel) {
            case 'colorAdjustment':
                return <HBulkAccordionColorAdjustment 
                            tempScore={tempScore}
                            tintScore={tintScore}
                            saturationScore={saturationScore}
                            exposureScore={exposureScore}
                            contrastScore={contrastScore}
                            whitesScore={whitesScore}
                            blacksScore={blacksScore}
                            highlightsScore={highlightsScore}
                            shadowsScore={shadowsScore}
                            clarityScore={clarityScore}
                            sharpnessScore={sharpnessScore}
                            expandedPanels={colorAdjustmentExpandedPanels}
                            onPanelChange={handleColorAccordionChange}
                        />;
            case 'preset':
                return <HBulkPreset
                            selectedPreset={selectedBulkPreset}
                            onSelectPreset={handleSelectBulkPreset}
                            expandedPanels={presetExpandedPanels}
                            onPanelChange={handlePresetAccordionChange}
                            presetMenuAnchorEl={presetMenuAnchorEl}
                            activePresetMenuId={activePresetMenuId}
                            isMenuOpen={Boolean(presetMenuAnchorEl)}
                            onPresetMenuClick={handlePresetMenuClick}
                            onPresetMenuClose={handlePresetMenuClose}
                            onRemovePreset={handleRemovePreset}
                            onRenamePreset={handleRenamePreset}
                            onDeletePreset={handleDeletePreset}
                            onOpenPresetModal={handleOpenPresetModal}
                        />;
            default:
                return null;
        }
    }

    const renderActivePanel = () => {
        switch (activePanel) {
            case 'colorAdjustment':
                return <HAccordionColorAdjustment 
                            tempScore={tempScore}
                            setTempScore={setTempScore}
                            tintScore={tintScore}
                            setTintScore={setTintScore}
                            exposureScore={exposureScore}
                            setExposureScore={setExposureScore}
                            HighlightsScore={highlightsScore}
                            setHighlightsScore={setHighlightsScore}
                            shadowsScore={shadowsScore}
                            setShadowsScore={setShadowsScore}
                            whitesScore={whitesScore}
                            setWhitesScore={setWhitesScore}
                            blacksScore={blacksScore}
                            setBlacksScore={setBlacksScore}
                            contrastScore={contrastScore}
                            setContrastScore={setContrastScore}
                            clarityScore={clarityScore}
                            setClarityScore={setClarityScore}
                            sharpnessScore={sharpnessScore}
                            setSharpnessScore={setSharpnessScore}
                            saturationScore={saturationScore}
                            setSaturationScore={setSaturationScore}
                            expandedPanels={colorAdjustmentExpandedPanels}
                            onPanelChange={handleColorAccordionChange}
                        />;
            // case 'aspectRatio':
            //     return <HAccordionAspectRatio
            //                 activeRatio={currentAspectRatio}
            //                 activeSquareRatio={currentSquareRatio}
            //                 activeWideRatio={currentWideRatio}
            //                 onRatioSelect={handleAspectRatioSelect}
            //                 angelChange={angelScore}
            //                 onAngleChange={setAngleScore}
            //                 widthPX={widthSizePX}
            //                 heightPX={heightSizePX}
            //                 onWidthChange={setWidthSizePX}
            //                 onHeightChange={setHeightSizePX}
            //             />;
            case 'preset':
                return <HAccordionPreset
                            expandedPanels={presetExpandedPanels}
                            onChange={handlePresetAccordionChange}
                            onOpenPresetModal={handleOpenPresetModal}
                            onOpenWatermarkView={handleOpenWatermarkView}
                            selectedPreset={selectedDesktopPreset}
                            onSelectPreset={handleSelectDesktopPreset}
                            presetMenuAnchorEl={presetMenuAnchorEl}
                            onPresetMenuClick={handlePresetMenuClick}
                            onPresetMenuClose={handlePresetMenuClose}
                            activePresetMenuId={activePresetMenuId}
                            onRemovePreset={handleRemovePreset}
                            onRenamePreset={handleRenamePreset}
                            onDeletePreset={handleDeletePreset}
                        />;
            default:
                return null;
        }
    };

    if (isCreatingWatermark) {
        return (
            <HWatermarkView
                onSaveWatermark={handleSaveWatermark}
                onCancelWatermark={handleCancelWatermark}
            />
        );
    }

    return(
        <>
            <Stack direction="column" justifyContent="center" sx={{ width: '100%', height: isMobile ? '100%' : '100vh', background: 'black', px: isMobile ? 0 : "100px" }}>
                {!isOnline && !isMobile && <HAlertBox />}
                {isPresetCreated && !isMobile && <HAlertBox />}
                <HHeaderEditor
                    onBack={handleBack}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onRevert={handleRevert}
                    onCopyEdit={handleCopyEdit}
                    onPasteEdit={handlePasteEdit}
                    anchorEl={headerMenuAnchorEl}
                    onMenuClick={handleHeaderMenuClick}
                    onMenuClose={handleHeaderMenuClose}
                    onSelectButton={toggleBulkEditing}
                    valueSelect={selectedImages}
                />
                <Stack direction={directionForEditor} justifyContent="space-between" alignItems="flex-start" sx={{ width: '100%'}}>
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <canvas
                        style={{
                            background: 'white',
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            maxWidth: '1140px',
                            maxHeight: '1140px'
                        }}
                        ></canvas>
                    </Box>
                    {!isMobile && !isBulkEditing && (
                        <HImageEditorDesktop 
                            activePanel={activePanel}
                            setActivePanel={setActivePanel}
                            onScale={handleScale}
                            onBeforeAfter={handleBeforeAfter}
                            isPanelOpen={!isMobile}
                            anchorElZoom={anchorMenuZoom}
                            onZoomMenuClose={handleZoomMenuClose}
                            onZoomAction={handleZoomAction}
                            footer={
                                <HFooter
                                    anchorElZoom={anchorMenuZoom}
                                    onScale={handleScale}
                                    onBeforeAfter={handleBeforeAfter}
                                    onZoomMenuClose={handleZoomMenuClose}
                                    onZoomAction={handleZoomAction}
                                />
                            }
                        >
                            {renderActivePanel()}
                        </HImageEditorDesktop>
                    )}

                    {!isMobile && isBulkEditing && (
                        <HImageEditorBulkDekstop 
                            activePanel={activePanel}
                            setActivePanel={setActivePanel}
                            onScale={handleScale}
                            onBeforeAfter={handleBeforeAfter}
                            isPanelOpen={!isMobile}
                            anchorElZoom={anchorMenuZoom}
                            onZoomMenuClose={handleZoomMenuClose}
                            onZoomAction={handleZoomAction}
                            footer={
                                <HFooter
                                    anchorElZoom={anchorMenuZoom}
                                    onScale={handleScale}
                                    onBeforeAfter={handleBeforeAfter}
                                    onZoomMenuClose={handleZoomMenuClose}
                                    onZoomAction={handleZoomAction}
                                />
                            }
                        >
                            {renderActivePanelBulk()}
                        </HImageEditorBulkDekstop>
                    )}

                    <HPresetOptionsMenu
                        anchorEl={presetMenuAnchorEl}
                        isOpen={Boolean(presetMenuAnchorEl)}
                        onClose={handlePresetMenuClose}
                        onRemove={handleRemovePreset}
                        onRename={handleRenamePreset}
                        onDelete={handleDeletePreset}
                        // Pass the conditional logic as a simple boolean prop
                        isPresetSelected={(isBulkEditing ? selectedBulkPreset : selectedDesktopPreset) === activePresetMenuId}
                    />

                    {isMobile && !isBulkEditing && (
                        <>
                            <Stack sx={{ width: '100%', padding: 2 }}>
                            </Stack>
                            <HImageEditorMobile 
                                // Pass the state and handlers down as props
                                contentRef={contentRef}
                                panelRef={panelRef}
                                panelHeight={panelHeight}
                                handleDragStart={handleDragStart}
                                onContentHeightChange={handleContentHeightChange}

                                // Other existing props
                                activePanel={activePanel}
                                setActivePanel={(panel) => {
                                    setActivePanel(panel);
                                    setActiveSubPanel(''); 
                                }}
                                activeSubPanel={activeSubPanel}
                                setActiveSubPanel={setActiveSubPanel}
                                tempScore={tempScore}
                                onTempChange={setTempScore}
                                tintScore={tintScore}
                                onTintChange={setTintScore}
                                saturationScore={saturationScore}
                                onSaturationChange={setSaturationScore}
                                exposureScore={exposureScore}
                                onExposureChange={setExposureScore}
                                highlightsScore={highlightsScore}
                                onHighlightsChange={setHighlightsScore}
                                shadowScore={shadowsScore}
                                onShadowsChange={setShadowsScore}
                                whiteScore={whitesScore}
                                onWhitesChange={setWhitesScore}
                                blackScore={blacksScore}
                                onBlacksChange={setBlacksScore}
                                contrastScore={contrastScore}
                                onContrastChange={setContrastScore}
                                clarityScore={clarityScore}
                                onClarityChange={setClarityScore}
                                sharpnessScore={sharpnessScore}
                                onSharpnessChange={setSharpnessScore}
                                onOpenPresetModal={handleOpenPresetModalMobile}
                                selectedPreset={selectedMobilePreset}
                                onSelectPreset={handleSelectMobilePreset}
                            />
                        </>
                    )}
                    {isMobile && isBulkEditing && (
                        <HImageEditorBulkMobile
                            // Pass the state and handlers down as props
                            contentRef={contentRef}
                            panelRef={panelRef}
                            panelHeight={panelHeight}
                            handleDragStart={handleDragStart}
                            onContentHeightChange={handleContentHeightChange}

                            // Other existing props
                            activePanel={activePanel}
                            setActivePanel={(panel) => {
                                setActivePanel(panel);
                                setActiveSubPanel(''); 
                            }}
                            activeSubPanel={activeSubPanel}
                            setActiveSubPanel={setActiveSubPanel}
                            tempScore={tempScore}
                            onTempChange={setTempScore}
                            tintScore={tintScore}
                            onTintChange={setTintScore}
                            saturationScore={saturationScore}
                            onSaturationChange={setSaturationScore}
                            exposureScore={exposureScore}
                            onExposureChange={setExposureScore}
                            highlightsScore={highlightsScore}
                            onHighlightsChange={setHighlightsScore}
                            shadowsScore={shadowsScore}
                            onShadowsChange={setShadowsScore}
                            whitesScore={whitesScore}
                            onWhitesChange={setWhitesScore}
                            blacksScore={blacksScore}
                            onBlacksChange={setBlacksScore}
                            contrastScore={contrastScore}
                            onContrastChange={setContrastScore}
                            clarityScore={clarityScore}
                            onClarityChange={setClarityScore}
                            sharpnessScore={sharpnessScore}
                            onSharpnessChange={setSharpnessScore}
                            selectedPresetBulk={selectedBulkPreset}
                            onOpenPresetModalBulk={handleOpenPresetModalMobile}
                            onSelectPresetBulk={handleSelectBulkPreset}
                            onPresetMenuClickBulk={handlePresetMenuClick}
                        />
                    )}
                    {/* <HBaseDialog
                        description="Create a preset with the current Light, Colour and Details settings"
                        title="Create Preset"
                        onClose={handleClosePresetModal}
                    /> */}
                    <HModalEditorDekstop
                        modalName="preset"
                        modalOpen={isPresetModalOpen}
                        modalTitle="Create Preset"
                        modalInformation="Create a preset with the current Light, Colour and Details settings"
                        modalClose={handleClosePresetModal}
                        onConfirm={handleCreatePreset}
                    >
                        <HTextField valueName={presetName} setName={handleNameChange} />
                    </HModalEditorDekstop>
                    <HModalMobile
                        modalName="preset"
                        modalOpen={isPresetModalOpenMobile}
                        modalTitle="Create Preset"
                        modalInformation="Create a preset with the current Light, Colour and Details settings"
                        modalClose={handleClosePresetModalMobile}
                        onConfirm={handleCreatePresetMobile}
                    >
                        <HTextField valueName={presetName} setName={handleNameChange} />
                    </HModalMobile>
                </Stack>
            </Stack>
        </>
    )
}