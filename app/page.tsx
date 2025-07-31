'use client';
import React from "react";
import { Box, Stack, CircularProgress, Typography } from "@mui/material";
import Script from "next/script";
import useIsMobile from "@/utils/isMobile";
// Components
import HHeaderEditor from "@/components/editor/HHeaderEditor";
import HAccordionColorAdjustment from "@/components/editor/HAccordionColorAdjustment";
import HAccordionPreset from "@/components/editor/HAccordionPreset";
import { HBaseDialog, HDialogForPreset } from "@/components/editor/HDialogBox";
import { HDialogCopy } from "@/components/editor/HDialogCopy";
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
import { HAlertInternetBox, HAlertCopyBox } from "@/components/editor/HAlertBox";
// Hooks
import { useHonchoEditor } from "@/hooks/editor/useHonchoEditor";
// API Controller
import { apiController } from "@/lib/api/editorController";

export default function HImageEditor() {

    const editor = useHonchoEditor(apiController);
    const isMobile = useIsMobile();

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
                        saturationScore={editor.saturationScore}
                        setSaturationScore={editor.setSaturationScore}
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
            <Stack direction="column" justifyContent="center" sx={{ width: '100%', height: isMobile ? '100%' : '100vh', background: 'black', px: isMobile ? 0 : "100px" }}>
                {!editor.isOnline && !isMobile && <HAlertInternetBox />}
                {editor.isPresetCreated && !isMobile && <HAlertInternetBox />}
                {editor.showCopyAlert && <HAlertCopyBox />}

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
                <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="stretch" sx={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        p: isMobile ? 2 : 4,
                        minHeight: 0
                    }}>
                        <input type="file" ref={editor.fileInputRef} onChange={editor.handleFileChange} accept="image/png, image/jpeg, image/webp" style={{ display: 'none' }} />
                        {!editor.isImageLoaded ? (
                            <Box onClick={() => editor.fileInputRef.current?.click()} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed grey', borderRadius: 2, p: 4, cursor: editor.isEditorReady ? 'pointer' : 'default', textAlign: 'center', color: 'grey.500', width: '100%', height: '300px' }}>
                                {!editor.isEditorReady && <CircularProgress color="inherit" sx={{ mb: 2 }} />}
                                <Typography variant="h6">{editor.editorStatus}</Typography>
                            </Box>
                        ) : (
                            <canvas ref={editor.canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
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
                                    onBeforeAfter={() => console.log("Before/After toggled!")}
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
                                    onBeforeAfter={() => console.log("Before/After toggled!")}
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
                            contentRef={editor.contentRef}
                            panelRef={editor.panelRef}
                            panelHeight={editor.panelHeight}
                            handleDragStart={editor.handleDragStart}
                            onContentHeightChange={editor.handleContentHeightChange}
                            activePanel={editor.activePanel}
                            setActivePanel={(panel) => { editor.setActivePanel(panel); editor.setActiveSubPanel(''); }}
                            activeSubPanel={editor.activeSubPanel}
                            setActiveSubPanel={editor.setActiveSubPanel}
                            
                            // Color Adjustments
                            tempScore={editor.tempScore}
                            onTempChange={editor.setTempScore}
                            tintScore={editor.tintScore}
                            onTintChange={editor.setTintScore}
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
                            contentRef={editor.contentRef}
                            panelRef={editor.panelRef}
                            panelHeight={editor.panelHeight}
                            handleDragStart={editor.handleDragStart}
                            onContentHeightChange={editor.handleContentHeightChange}
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
                        modalInformation="Create a preset with the current Light, Colour and Details settings"
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
                            colorAdjustments={editor.colorAdjustments}
                            lightAdjustments={editor.lightAdjustments}
                            detailsAdjustments={editor.detailsAdjustments}
                            onCopyEdit={editor.handleConfirmCopy}
                        />
                    }
                />
            )}
            <HDialogForPreset
                open={editor.isRenameModalOpen}
                title={"Rename"}
                description={"Rename a preset with the current Light, Colour and Details settings"}
                onClose={editor.handleCloseRenameModal}
                action={
                    <HTextFieldRename
                        valueName={editor.newPresetName}
                        setName={(e) => editor.setNewPresetName(e.target.value)}
                        onSaveRenamePreset={editor.handleConfirmRename}
                        onCancel={editor.handleCloseRenameModal}
                    />
                }
            />
        </>
    )
}