'use client';
import React, { useState, useCallback, useEffect, useRef, Suspense  } from "react";
import { Box, Stack, CircularProgress, Typography, Checkbox, Paper } from "@mui/material";
import useColors from "@/colors";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'; // Magic Wand Icon
import Script from "next/script";
import { useSearchParams } from 'next/navigation';
import useIsMobile from "@/utils/isMobile";
// Components
import HHeaderEditor from "@/components/editor/HHeaderEditor";
import HAccordionColorAdjustment from "@/components/editor/HAccordionColorAdjustment";
import HAccordionPreset from "@/components/editor/HAccordionPreset";
import { HBaseDialog, HDialogForPreset } from "@/components/editor/HDialogBox";
import { HDialogCopy, HDialogPreset } from "@/components/editor/HDialogCopy";
import HImageEditorMobile from "@/components/editor/HImageEditorMobile";
import HImageEditorDesktop from "@/components/editor/HImageEditorDekstop";
import HImageEditorBulkDekstop from "@/components/editor/HImageEditorBulkDekstop";
import HImageEditorBulkMobile from "@/components/editor/HImageEditorBulkMobile";
import HBulkAccordionColorAdjustment from "@/components/editor/HBulkAccordionColorAdjustment";
import HBulkPreset from "@/components/editor/HBulkPreset";
import HModalEditorDekstop from "@/components/editor/HModalEditorDekstop";
import HFooter from "@/components/editor/HFooter";
import {HTextField, HTextFieldRename} from "@/components/editor/HTextField";
import HWatermarkView from "@/components/editor/HWatermarkView";
import HModalMobile from "@/components/editor/HModalMobile";
import HPresetOptionsMenu from "@/components/editor/HPresetOptionMenu";
import { HAlertInternetBox, HAlertCopyBox, HAlertInternetConnectionBox } from "@/components/editor/HAlertBox";
// Hooks
import { useHonchoEditor, AdjustmentState  } from "@/hooks/editor/useHonchoEditor";
// API Controller
import { apiController } from "@/lib/api/editorController";

const initialAdjustments: AdjustmentState = {
    tempScore: 0, tintScore: 0, vibranceScore: 0, exposureScore: 0, highlightsScore: 0, shadowsScore: 0,
    whitesScore: 0, blacksScore: 0, saturationScore: 0, contrastScore: 0, clarityScore: 0, sharpnessScore: 0,
};

// Helper to check if an image has any edits
const hasAdjustments = (state: AdjustmentState): boolean => {
    if (!state) return false;
    return Object.values(state).some(value => value !== 0);
};

function HImageEditorClient() {
    const editor = useHonchoEditor(apiController);
    const isMobile = useIsMobile();
    const colors = useColors();
    const searchParams = useSearchParams();

    const PEEK_HEIGHT = 20;
    const COLLAPSED_HEIGHT = 165;

    // Mobile Draggable Panel State
    const [panelHeight, setPanelHeight] = useState(165);
    const [contentHeight, setContentHeight] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef(0);
    const initialHeight = useRef(0);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [displayedToken, setDisplayedToken] = useState<string | null>(null);

    const PANEL_CHROME_HEIGHT = 10;

     // Mobile Panel Drag Handlers
    const handleContentHeightChange = useCallback((height: number) => {
        if (height > 0 && height !== contentHeight) setContentHeight(height);
    }, [contentHeight]);

    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStartPos.current = startY;
        initialHeight.current = panelHeight;
        if (panelRef.current) panelRef.current.style.transition = 'none';
    }, [panelHeight]);

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const deltaY = dragStartPos.current - currentY;
        const newHeight = initialHeight.current + deltaY;
        const dynamicPanelFullHeight = contentHeight + PANEL_CHROME_HEIGHT;
        
        // UPDATED: Allow dragging down to the new PEEK_HEIGHT
        const clampedHeight = Math.max(PEEK_HEIGHT, Math.min(newHeight, dynamicPanelFullHeight));
        setPanelHeight(clampedHeight);
    }, [isDragging, contentHeight]);

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        dragStartPos.current = 0;
        if (panelRef.current) panelRef.current.style.transition = 'height 0.3s ease-in-out';
        
        const dynamicPanelFullHeight = contentHeight + PANEL_CHROME_HEIGHT;

        // UPDATED: New logic to snap to one of three points
        const snapPointLow = (PEEK_HEIGHT + COLLAPSED_HEIGHT) / 2;
        const snapPointHigh = (COLLAPSED_HEIGHT + dynamicPanelFullHeight) / 2;

        if (panelHeight < snapPointLow) {
            setPanelHeight(PEEK_HEIGHT); // Snap down to the "peek" state
        } else if (panelHeight >= snapPointLow && panelHeight < snapPointHigh) {
            setPanelHeight(COLLAPSED_HEIGHT); // Snap to the default collapsed state
        } else {
            setPanelHeight(dynamicPanelFullHeight); // Snap to the fully open state
        }
    }, [isDragging, panelHeight, contentHeight]);
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (contentRef.current) {
                // Use scrollHeight to get the full height of the content
                const height = contentRef.current.scrollHeight;
                setContentHeight(height);
            }
        }, 50); // Small delay for content to render before measuring

        return () => clearTimeout(timeoutId);
    }, [editor.activeSubPanel, editor.isBulkEditing]);

    const handleBack = () => {
        if ((window as any).webkit?.messageHandlers?.nativeHandler) {
            (window as any).webkit.messageHandlers.nativeHandler.postMessage("back");
            console.log("Sent 'back' message to iOS native handler.");
        } 
        else if ((window as any).Android?.goBack) {
            console.log("Android environment detected. Calling goBack().");
            (window as any).Android.goBack();
        }
        else {
            console.log("Standard web browser detected. Navigating back in history.");
            window.history.back();
        }
    };

    // ADD this new useEffect to read the query parameters when the page loads
    useEffect(() => {
        const imageId = searchParams.get('imageId');
        const token = searchParams.get('token');

        if (token) {
            console.log("Received auth token from query params.");
            apiController.setToken(token);
            setDisplayedToken(token);
        }

        if (imageId) {
            console.log(`Received imageId from query params: ${imageId}`);
            editor.loadImageFromId(imageId);
        }
    }, [editor.loadImageFromId, searchParams, setDisplayedToken]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
            event.preventDefault();
            
            editor.handleOpenCopyDialog();
        }
    }, [editor.handleOpenCopyDialog]);

    useEffect(() => {
        // Add the event listener when the component mounts
        window.addEventListener('keydown', handleKeyDown);

        // IMPORTANT: Remove the event listener when the component unmounts to prevent memory leaks
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

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

    // Dummy/placeholder handlers that remain in the component
    const handleScale = (event: React.MouseEvent<HTMLElement>) => editor.setAnchorMenuZoom(event.currentTarget);
    const handleBeforeAfter = () => console.log("Before/After toggled!");
    // const handleZoomMenuClose = () => editor.setAnchorMenuZoom(null);
    // const handleZoomAction = (level: string) => { console.log(`Zoom: ${level}`); handleZoomMenuClose(); };

    const renderActivePanelBulk = () => {
        // MARK: Dekstop Bulk Editor panels
        switch (editor.activePanel) {
            case 'colorAdjustment':
                return (
                    <HBulkAccordionColorAdjustment
                        // Adjustments Colors
                        onTempDecreaseMax={editor.handleBulkTempDecreaseMax}
                        onTempDecrease={editor.handleBulkTempDecrease}
                        onTempIncrease={editor.handleBulkTempIncrease}
                        onTempIncreaseMax={editor.handleBulkTempIncreaseMax}
                        onTintDecreaseMax={editor.handleBulkTintDecreaseMax}
                        onTintDecrease={editor.handleBulkTintDecrease}
                        onTintIncrease={editor.handleBulkTintIncrease}
                        onTintIncreaseMax={editor.handleBulkTintIncreaseMax}
                        onVibranceDecreaseMax={editor.handleBulkVibranceDecreaseMax}
                        onVibranceDecrease={editor.handleBulkVibranceDecrease}
                        onVibranceIncrease={editor.handleBulkVibranceIncrease}
                        onVibranceIncreaseMax={editor.handleBulkVibranceIncreaseMax}
                        onSaturationDecreaseMax={editor.handleBulkSaturationDecreaseMax}
                        onSaturationDecrease={editor.handleBulkSaturationDecrease}
                        onSaturationIncrease={editor.handleBulkSaturationIncrease}
                        onSaturationIncreaseMax={editor.handleBulkSaturationIncreaseMax}
                        // Adjustments Light
                        onExposureDecreaseMax= {editor.handleBulkExposureDecreaseMax}
                        onExposureDecrease= {editor.handleBulkExposureDecrease}
                        onExposureIncrease= {editor.handleBulkExposureIncrease}
                        onExposureIncreaseMax= {editor.handleBulkExposureIncreaseMax}
                        onContrastDecreaseMax= {editor.handleBulkContrastDecreaseMax}
                        onContrastDecrease= {editor.handleBulkContrastDecrease}
                        onContrastIncrease= {editor.handleBulkContrastIncrease}
                        onContrastIncreaseMax= {editor.handleBulkContrastIncreaseMax}
                        onHighlightsDecreaseMax= {editor.handleBulkHighlightsDecreaseMax}
                        onHighlightsDecrease= {editor.handleBulkHighlightsDecrease}
                        onHighlightsIncrease= {editor.handleBulkHighlightsIncrease}
                        onHighlightsIncreaseMax= {editor.handleBulkHighlightsIncreaseMax}
                        onShadowsDecreaseMax= {editor.handleBulkShadowsDecreaseMax}
                        onShadowsDecrease= {editor.handleBulkShadowsDecrease}
                        onShadowsIncrease= {editor.handleBulkShadowsIncrease}
                        onShadowsIncreaseMax= {editor.handleBulkShadowsIncreaseMax}
                        onWhitesDecreaseMax= {editor.handleBulkWhitesDecreaseMax}
                        onWhitesDecrease= {editor.handleBulkWhitesDecrease}
                        onWhitesIncrease= {editor.handleBulkWhitesIncrease}
                        onWhitesIncreaseMax= {editor.handleBulkWhitesIncreaseMax}
                        onBlacksDecreaseMax= {editor.handleBulkBlacksDecreaseMax}
                        onBlacksDecrease= {editor.handleBulkBlacksDecrease}
                        onBlacksIncrease= {editor.handleBulkBlacksIncrease}
                        onBlacksIncreaseMax= {editor.handleBulkBlacksIncreaseMax}
                        // Adjustments Details
                        onClarityDecreaseMax={editor.handleBulkClarityDecreaseMax}
                        onClarityDecrease={editor.handleBulkClarityDecrease}
                        onClarityIncrease={editor.handleBulkClarityIncrease}
                        onClarityIncreaseMax={editor.handleBulkClarityIncreaseMax}
                        onSharpnessDecreaseMax={editor.handleBulkSharpnessDecreaseMax}
                        onSharpnessDecrease={editor.handleBulkSharpnessDecrease}
                        onSharpnessIncrease={editor.handleBulkSharpnessIncrease}
                        onSharpnessIncreaseMax={editor.handleBulkSharpnessIncreaseMax}
                        
                        // Panels Management
                        expandedPanels={editor.colorAdjustmentExpandedPanels}
                        onPanelChange={editor.handleColorAccordionChange}
                    />
                );
            case 'preset':
                return (
                    <HBulkPreset
                        presets={editor.presets}
                        selectedPreset={editor.selectedBulkPreset}
                        onSelectPreset={editor.handleSelectBulkPreset}
                        expandedPanels={editor.presetExpandedPanels}
                        onPanelChange={editor.handlePresetAccordionChange}
                        presetMenuAnchorEl={editor.presetMenuAnchorEl}
                        activePresetMenuId={editor.activePresetMenuId}
                        isMenuOpen={Boolean(editor.presetMenuAnchorEl)}
                        onPresetMenuClick={editor.handlePresetMenuClick}
                        onPresetMenuClose={editor.handlePresetMenuClose}
                        onRemovePreset={editor.handleRemovePreset}
                        onRenamePreset={editor.handleOpenRenameModal}
                        onDeletePreset={editor.handleDeletePreset}
                        onOpenPresetModal={editor.handleOpenPresetModal}
                    />
                );
            default: return null;
        }
    }

    const renderActivePanel = () => {
        // MARK: Dekstop Editor panels
        switch (editor.activePanel) {
            case 'colorAdjustment':
                return (
                    <HAccordionColorAdjustment
                        tempScore={editor.tempScore}
                        setTempScore={editor.setTempScore}
                        tintScore={editor.tintScore}
                        setTintScore={editor.setTintScore}
                        vibranceScore={editor.vibranceScore}
                        setVibranceScore={editor.setVibranceScore}
                        saturationScore={editor.saturationScore}
                        setSaturationScore={editor.setSaturationScore}
                        exposureScore={editor.exposureScore}
                        setExposureScore={editor.setExposureScore}
                        HighlightsScore={editor.highlightsScore}
                        setHighlightsScore={editor.setHighlightsScore}
                        shadowsScore={editor.shadowsScore}
                        setShadowsScore={editor.setShadowsScore}
                        whitesScore={editor.whitesScore}
                        setWhitesScore={editor.setWhitesScore}
                        blacksScore={editor.blacksScore}
                        setBlacksScore={editor.setBlacksScore}
                        contrastScore={editor.contrastScore}
                        setContrastScore={editor.setContrastScore}
                        clarityScore={editor.clarityScore}
                        setClarityScore={editor.setClarityScore}
                        sharpnessScore={editor.sharpnessScore}
                        setSharpnessScore={editor.setSharpnessScore}
                        expandedPanels={editor.colorAdjustmentExpandedPanels}
                        onPanelChange={editor.handleColorAccordionChange}
                    />
                );
            case 'preset':
                return (
                    <HAccordionPreset
                        presets={editor.presets}
                        expandedPanels={editor.presetExpandedPanels}
                        onChange={editor.handlePresetAccordionChange}
                        onOpenPresetModal={editor.handleOpenPresetModal}
                        onOpenWatermarkView={editor.handleOpenWatermarkView}
                        selectedPreset={editor.selectedDesktopPreset}
                        onSelectPreset={editor.handleSelectDesktopPreset}
                        presetMenuAnchorEl={editor.presetMenuAnchorEl}
                        onPresetMenuClick={editor.handlePresetMenuClick}
                        onPresetMenuClose={editor.handlePresetMenuClose}
                        activePresetMenuId={editor.activePresetMenuId}
                        onRemovePreset={editor.handleRemovePreset}
                        onRenamePreset={editor.handleOpenRenameModal}
                        onDeletePreset={editor.handleDeletePreset}
                    />
                );
            default: return null;
        }
    };

    if (editor.isCreatingWatermark) {
        return (
            <HWatermarkView
                onSaveWatermark={editor.handleSaveWatermark}
                onCancelWatermark={editor.handleCancelWatermark}
            />
        );
    }

    return (
        <>
            <Script
                src="/honcho-photo-editor.js"
                strategy="lazyOnload"
                onReady={() => {
                    editor.handleScriptReady();
                }}
            />
            <Stack direction="column" justifyContent="center" sx={{ width: '100%', height: isMobile ? '100%' : '100vh', background: 'black', pl: isMobile ? 0 : "24px", pr: isMobile ? 0 : "0px" }}>
                {editor.isConnectionSlow && <HAlertInternetConnectionBox onClose={editor.handleAlertClose} />}
                {!editor.isOnline && <HAlertInternetBox />}
                {editor.isPresetCreated && !isMobile && <HAlertInternetBox />}
                {editor.showCopyAlert && <HAlertCopyBox />}
                {displayedToken && (
                    <Box sx={{ p: 1, mx: 2, backgroundColor: 'grey.900', borderRadius: 1, mt: 1 }}>
                        <Typography variant="caption" sx={{ color: 'lime', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            <strong>Token Received:</strong> {displayedToken}
                        </Typography>
                    </Box>
                )}

                <HHeaderEditor
                    onBack={handleBack}
                    onUndo={editor.handleUndo}
                    onRedo={editor.handleRedo}
                    onRevert={editor.handleRevert}
                    onCopyEdit={editor.handleOpenCopyDialog}
                    onPasteEdit={editor.handlePasteEdit}
                    isPasteEnabled={editor.isPasteAvailable}
                    anchorEl={editor.headerMenuAnchorEl}
                    onMenuClick={editor.handleHeaderMenuClick}
                    onMenuClose={editor.handleHeaderMenuClose}
                    onSelectButton={editor.toggleBulkEditing}
                    valueSelect={editor.selectedImages}
                />
                <Stack
                    direction={isMobile ? "column" : "row"}
                    justifyContent="space-between"
                    alignItems="stretch"
                    sx={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}
                >
                    {/* Main Canvas Area */}
                    <Box sx={{ 
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center', // This will now work correctly on mobile
                        position: 'relative',
                        p: isMobile ? 2 : 4,
                        minHeight: 720
                     }}>
                        <input type="file" ref={editor.fileInputRef} onChange={editor.handleFileChange} multiple accept="image/*" style={{ display: 'none' }} />

                        {!editor.isImageLoaded ? (
                            <Box onClick={() => editor.fileInputRef.current?.click()} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed grey', borderRadius: 2, p: 4, cursor: editor.isEditorReady ? 'pointer' : 'default', textAlign: 'center', color: 'grey.500', width: '100%', height: '300px' }}>
                                {!editor.isEditorReady && <CircularProgress color="inherit" sx={{ mb: 2 }} />}
                                <Typography variant="h6">{editor.editorStatus}</Typography>
                            </Box>
                        ) : (
                            editor.isBulkEditing ? (
                                // Responsive Image Grid for Bulk Edit
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                    gap: 2,
                                    width: '100%',
                                    height: '100%',
                                    p: 1
                                }}>
                                    {editor.imageList.map(image => {
                                        const imageAdjustments = editor.adjustmentsMap.get(image.id) || initialAdjustments;
                                        const isEdited = hasAdjustments(imageAdjustments);

                                        return (
                                            <Paper
                                                key={image.id}
                                                elevation={3}
                                                sx={{
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    aspectRatio: '1 / 1',
                                                    '& img': {
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        display: 'block',
                                                        transition: 'opacity 0.2s ease-in-out',
                                                        opacity: editor.selectedImageIds.has(image.id) ? 1 : 0.4,
                                                    }
                                                }}
                                            >
                                                <img src={image.url} alt={image.name} />
                                                <Checkbox
                                                    checked={editor.selectedImageIds.has(image.id)}
                                                    onChange={() => editor.handleToggleImageSelection(image.id)}
                                                    sx={{
                                                        position: 'absolute', top: 4, left: 4, color: 'common.white',
                                                        '&.Mui-checked': { color: '#1976d2' },
                                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
                                                    }}
                                                />
                                                {isEdited && (
                                                    <AutoFixHighIcon 
                                                        fontSize="small"
                                                        sx={{ 
                                                            position: 'absolute', 
                                                            bottom: 8, 
                                                            right: 8, 
                                                            color: 'white', 
                                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                            borderRadius: '50%',
                                                            padding: '2px'
                                                        }} 
                                                    />
                                                )}
                                            </Paper>
                                        );
                                    })}
                                </Box>
                            ) : (
                                // Canvas for Single Edit
                                <canvas ref={editor.canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
                            )
                        )}
                    </Box>

                    {!isMobile && !editor.isBulkEditing && (
                        <HImageEditorDesktop
                            activePanel={editor.activePanel}
                            setActivePanel={editor.setActivePanel}
                            onScale={handleScale}
                            onBeforeAfter={handleBeforeAfter}
                            isPanelOpen={!isMobile}
                            anchorElZoom={editor.anchorMenuZoom}
                            onZoomMenuClose={() => editor.setAnchorMenuZoom(null)}
                            onZoomAction={editor.handleZoomAction}
                            footer={
                                <HFooter
                                    anchorElZoom={editor.anchorMenuZoom}
                                    onScale={(event: React.MouseEvent<HTMLElement>) => editor.setAnchorMenuZoom(event.currentTarget)}
                                    onShowOriginal={editor.handleShowOriginal}
                                    onShowEdited={editor.handleShowEdited}
                                    onZoomMenuClose={() => editor.setAnchorMenuZoom(null)}
                                    onZoomAction={editor.handleZoomAction}
                                    zoomLevelText={editor.zoomLevelText} 
                                />
                            }
                        >
                            {renderActivePanel()}
                        </HImageEditorDesktop>
                    )}

                    {!isMobile && editor.isBulkEditing && (
                        <HImageEditorBulkDekstop
                            activePanel={editor.activePanel}
                            setActivePanel={editor.setActivePanel}
                            onScale={handleScale}
                            onBeforeAfter={handleBeforeAfter}
                            isPanelOpen={!isMobile}
                            anchorElZoom={editor.anchorMenuZoom}
                            onZoomMenuClose={() => editor.setAnchorMenuZoom(null)}
                            onZoomAction={editor.handleZoomAction}
                            footer={
                                <HFooter
                                    anchorElZoom={editor.anchorMenuZoom}
                                    onScale={(event: React.MouseEvent<HTMLElement>) => editor.setAnchorMenuZoom(event.currentTarget)}
                                    onShowOriginal={editor.handleShowOriginal}
                                    onShowEdited={editor.handleShowEdited}
                                    onZoomMenuClose={() => editor.setAnchorMenuZoom(null)}
                                    onZoomAction={editor.handleZoomAction}
                                    zoomLevelText={editor.zoomLevelText} 
                                />
                            }
                        >
                            {renderActivePanelBulk()}
                        </HImageEditorBulkDekstop>
                    )}

                    {isMobile && !editor.isBulkEditing && (
                        <HImageEditorMobile
                            presets={editor.presets}
                            contentRef={contentRef}
                            panelRef={panelRef}
                            panelHeight={panelHeight}
                            handleDragStart={handleDragStart}
                            onContentHeightChange={handleContentHeightChange}
                            activePanel={editor.activePanel}
                            setActivePanel={(panel) => { editor.setActivePanel(panel); editor.setActiveSubPanel(''); }}
                            activeSubPanel={editor.activeSubPanel}
                            setActiveSubPanel={editor.setActiveSubPanel}
                            
                            // Color Adjustments
                            tempScore={editor.tempScore}
                            onTempChange={editor.setTempScore}
                            tintScore={editor.tintScore}
                            onTintChange={editor.setTintScore}
                            vibranceScore={editor.vibranceScore}
                            onVibranceChange={editor.setVibranceScore}
                            saturationScore={editor.saturationScore}
                            onSaturationChange={editor.setSaturationScore}

                            // Adjustments Light
                            exposureScore={editor.exposureScore}
                            onExposureChange={editor.setExposureScore}
                            contrastScore={editor.contrastScore}
                            onContrastChange={editor.setContrastScore}
                            highlightsScore={editor.highlightsScore}
                            onHighlightsChange={editor.setHighlightsScore}
                            shadowScore={editor.shadowsScore}
                            onShadowsChange={editor.setShadowsScore}
                            whiteScore={editor.whitesScore}
                            onWhitesChange={editor.setWhitesScore}
                            blackScore={editor.blacksScore}
                            onBlacksChange={editor.setBlacksScore}

                            // Adjustments Details
                            clarityScore={editor.clarityScore}
                            onClarityChange={editor.setClarityScore}
                            sharpnessScore={editor.sharpnessScore}
                            onSharpnessChange={editor.setSharpnessScore}
                            
                            // Modal Management
                            onOpenPresetModal={editor.handleOpenPresetModalMobile}
                            presetOptionModal={editor.handlePresetMenuClick}
                            selectedPreset={editor.selectedMobilePreset}
                            onSelectPreset={editor.handleSelectMobilePreset}
                        />
                    )}
                    {isMobile && editor.isBulkEditing && (
                        <HImageEditorBulkMobile
                            presets={editor.presets}
                            contentRef={contentRef}
                            panelRef={panelRef}
                            panelHeight={panelHeight}
                            handleDragStart={handleDragStart}
                            onContentHeightChange={handleContentHeightChange}
                            activePanel={editor.activePanel}
                            setActivePanel={(panel) => { editor.setActivePanel(panel); editor.setActiveSubPanel(''); }}
                            activeSubPanel={editor.activeSubPanel}
                            setActiveSubPanel={editor.setActiveSubPanel}
                            
                            // Color Adjustments
                            onTempDecreaseMax={editor.handleBulkTempDecreaseMax}
                            onTempDecrease={editor.handleBulkTempDecrease}
                            onTempIncrease={editor.handleBulkTempIncrease}
                            onTempIncreaseMax={editor.handleBulkTempIncreaseMax}
                            onTintDecreaseMax={editor.handleBulkTintDecreaseMax}
                            onTintDecrease={editor.handleBulkTintDecrease}
                            onTintIncrease={editor.handleBulkTintIncrease}
                            onTintIncreaseMax={editor.handleBulkTintIncreaseMax}
                            onVibranceDecreaseMax={editor.handleBulkVibranceDecreaseMax}
                            onVibranceDecrease={editor.handleBulkVibranceDecrease}
                            onVibranceIncrease={editor.handleBulkVibranceIncrease}
                            onVibranceIncreaseMax={editor.handleBulkVibranceIncreaseMax}
                            onSaturationDecreaseMax={editor.handleBulkSaturationDecreaseMax}
                            onSaturationDecrease={editor.handleBulkSaturationDecrease}
                            onSaturationIncrease={editor.handleBulkSaturationIncrease}
                            onSaturationIncreaseMax={editor.handleBulkSaturationIncreaseMax}
                            // Adjustments Light
                            onExposureDecreaseMax= {editor.handleBulkExposureDecreaseMax}
                            onExposureDecrease= {editor.handleBulkExposureDecrease}
                            onExposureIncrease= {editor.handleBulkExposureIncrease}
                            onExposureIncreaseMax= {editor.handleBulkExposureIncreaseMax}
                            onContrastDecreaseMax= {editor.handleBulkContrastDecreaseMax}
                            onContrastDecrease= {editor.handleBulkContrastDecrease}
                            onContrastIncrease= {editor.handleBulkContrastIncrease}
                            onContrastIncreaseMax= {editor.handleBulkContrastIncreaseMax}
                            onHighlightsDecreaseMax= {editor.handleBulkHighlightsDecreaseMax}
                            onHighlightsDecrease= {editor.handleBulkHighlightsDecrease}
                            onHighlightsIncrease= {editor.handleBulkHighlightsIncrease}
                            onHighlightsIncreaseMax= {editor.handleBulkHighlightsIncreaseMax}
                            onShadowsDecreaseMax= {editor.handleBulkShadowsDecreaseMax}
                            onShadowsDecrease= {editor.handleBulkShadowsDecrease}
                            onShadowsIncrease= {editor.handleBulkShadowsIncrease}
                            onShadowsIncreaseMax= {editor.handleBulkShadowsIncreaseMax}
                            onWhitesDecreaseMax= {editor.handleBulkWhitesDecreaseMax}
                            onWhitesDecrease= {editor.handleBulkWhitesDecrease}
                            onWhitesIncrease= {editor.handleBulkWhitesIncrease}
                            onWhitesIncreaseMax= {editor.handleBulkWhitesIncreaseMax}
                            onBlacksDecreaseMax= {editor.handleBulkBlacksDecreaseMax}
                            onBlacksDecrease= {editor.handleBulkBlacksDecrease}
                            onBlacksIncrease= {editor.handleBulkBlacksIncrease}
                            onBlacksIncreaseMax= {editor.handleBulkBlacksIncreaseMax}
                            // Adjustments Details
                            onClarityDecreaseMax={editor.handleBulkClarityDecreaseMax}
                            onClarityDecrease={editor.handleBulkClarityDecrease}
                            onClarityIncrease={editor.handleBulkClarityIncrease}
                            onClarityIncreaseMax={editor.handleBulkClarityIncreaseMax}
                            onSharpnessDecreaseMax={editor.handleBulkSharpnessDecreaseMax}
                            onSharpnessDecrease={editor.handleBulkSharpnessDecrease}
                            onSharpnessIncrease={editor.handleBulkSharpnessIncrease}
                            onSharpnessIncreaseMax={editor.handleBulkSharpnessIncreaseMax}

                            selectedPresetBulk={editor.selectedBulkPreset}
                            onOpenPresetModalBulk={editor.handleOpenPresetModalMobile}
                            onSelectPresetBulk={editor.handleSelectBulkPreset}
                            onPresetMenuClickBulk={editor.handlePresetMenuClick}
                        />
                    )}

                    <HPresetOptionsMenu
                        anchorEl={editor.presetMenuAnchorEl}
                        isOpen={Boolean(editor.presetMenuAnchorEl)}
                        onClose={editor.handlePresetMenuClose}
                        onRemove={editor.handleRemovePreset}
                        onRename={editor.handleOpenRenameModal}
                        onDelete={editor.handleDeletePreset}
                        isPresetSelected={(editor.isBulkEditing ? editor.selectedBulkPreset : editor.selectedDesktopPreset) === editor.activePresetMenuId}
                    />
                    <HModalEditorDekstop
                        modalName="preset"
                        modalOpen={editor.isPresetModalOpen}
                        modalTitle="Create Preset"
                        modalInformation="Choose settings to include in preset"
                        action={
                            <HDialogPreset
                                colorChecks={editor.copyColorChecks}
                                lightChecks={editor.copyLightChecks}
                                detailsChecks={editor.copyDetailsChecks}
                                setColorChecks={editor.setCopyColorChecks}
                                setLightChecks={editor.setCopyLightChecks}
                                setDetailsChecks={editor.setCopyDetailsChecks}
                                expanded={editor.copyDialogExpanded}
                                onParentChange={editor.handleCopyParentChange}
                                onChildChange={editor.handleCopyChildChange}
                                onToggleExpand={editor.handleToggleCopyDialogExpand}
                            />
                        }
                        modalClose={editor.handleClosePresetModal}
                        onConfirm={editor.handleCreatePreset}
                    >
                        <HTextField valueName={editor.presetName} setName={editor.handleNameChange} />
                    </HModalEditorDekstop>
                    <HModalMobile
                        modalName="preset"
                        modalOpen={editor.isPresetModalOpenMobile}
                        modalTitle="Create Preset"
                        modalInformation="Create a preset with the current Light, Colour and Details settings"
                        modalClose={editor.handleClosePresetModalMobile}
                        onConfirm={editor.handleCreatePresetMobile}
                    >
                        <HTextField valueName={editor.presetName} setName={editor.handleNameChange} />
                    </HModalMobile>
                </Stack>
            </Stack>

            {editor.isCopyDialogOpen && (
                <HBaseDialog
                    open={editor.isCopyDialogOpen}
                    title="Copy Edits"
                    onClose={editor.handleCloseCopyDialog}
                    action={
                        <HDialogCopy
                            onCopyEdit={editor.handleConfirmCopy}
                
                            colorChecks={editor.copyColorChecks}
                            lightChecks={editor.copyLightChecks}
                            detailsChecks={editor.copyDetailsChecks}
                            
                            setColorChecks={editor.setCopyColorChecks}
                            setLightChecks={editor.setCopyLightChecks}
                            setDetailsChecks={editor.setCopyDetailsChecks}
                            
                            expanded={editor.copyDialogExpanded}
                            
                            onParentChange={editor.handleCopyParentChange}
                            onChildChange={editor.handleCopyChildChange}
                            onToggleExpand={editor.handleToggleCopyDialogExpand}
                        />
                    }
                />
            )}
        </>
    )
}


export default function HImageEditorPage() {
    const colors = useColors();

    const fallbackUI = (
        <Stack sx={{ width: '100%', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'black' }}>
            <CircularProgress sx={{ color: colors.onSurfaceVariant }} />
        </Stack>
    );
    
    return (
        <Suspense fallback={fallbackUI}>
            <HImageEditorClient />
        </Suspense>
    );
}