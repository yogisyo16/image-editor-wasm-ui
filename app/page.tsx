'use client';
import React from "react";
import { Box, Stack, CircularProgress, Typography } from "@mui/material";
import Script from "next/script";
import useIsMobile from "@/utils/isMobile";
// Components
import HHeaderEditor from "@/components/editor/HHeaderEditor";
import HAccordionColorAdjustment from "@/components/editor/HAccordionColorAdjustment";
import HAccordionPreset from "@/components/editor/HAccordionPreset";
import { HBaseDialog } from "@/components/editor/HDialogBox";
import { HDialogCopy } from "@/components/editor/HDialogCopy";
import HImageEditorMobile from "@/components/editor/HImageEditorMobile";
import HImageEditorDesktop from "@/components/editor/HImageEditorDekstop";
import HImageEditorBulkDekstop from "@/components/editor/HImageEditorBulkDekstop";
import HImageEditorBulkMobile from "@/components/editor/HImageEditorBulkMobile";
import HBulkAccordionColorAdjustment from "@/components/editor/HBulkAccordionColorAdjustment";
import HBulkPreset from "@/components/editor/HBulkPreset";
import HModalEditorDekstop from "@/components/editor/HModalEditorDekstop";
import HFooter from "@/components/editor/HFooter";
import HTextField from "@/components/editor/HTextField";
import HWatermarkView from "@/components/editor/HWatermarkView";
import HModalMobile from "@/components/editor/HModalMobile";
import HPresetOptionsMenu from "@/components/editor/HPresetOptionMenu";
import { HAlertInternetBox, HAlertCopyBox } from "@/components/editor/HAlertBox";
// Hooks
import { useHonchoEditor } from "@/hooks/editor/useHonchoEditor";

export default function HImageEditor() {
    const editor = useHonchoEditor();
    const isMobile = useIsMobile();

    // Dummy/placeholder handlers that remain in the component
    const handleScale = (event: React.MouseEvent<HTMLElement>) => editor.setAnchorMenuZoom(event.currentTarget);
    const handleZoomMenuClose = () => editor.setAnchorMenuZoom(null);
    const handleZoomAction = (level: string) => { console.log(`Zoom: ${level}`); handleZoomMenuClose(); };
    const handleBeforeAfter = () => console.log("Before/After toggled!");

    const renderActivePanelBulk = () => {
        // MARK: Dekstop Bulk Editor panels
        switch (editor.activePanel) {
            case 'colorAdjustment':
                return (
                    <HBulkAccordionColorAdjustment
                        tempScore={editor.tempScore}
                        tintScore={editor.tintScore}
                        saturationScore={editor.saturationScore}
                        exposureScore={editor.exposureScore}
                        contrastScore={editor.contrastScore}
                        whitesScore={editor.whitesScore}
                        blacksScore={editor.blacksScore}
                        highlightsScore={editor.highlightsScore}
                        shadowsScore={editor.shadowsScore}
                        adjustClarity={editor.adjustClarity}
                        adjustSharpness={editor.adjustSharpness}
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
                        onRenamePreset={editor.handleRenamePreset}
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
                        onRenamePreset={editor.handleRenamePreset}
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
                    onBack={editor.handleBack}
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
                            onZoomMenuClose={handleZoomMenuClose}
                            onZoomAction={handleZoomAction}
                            footer={
                                <HFooter
                                    anchorElZoom={editor.anchorMenuZoom}
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

                    {!isMobile && editor.isBulkEditing && (
                        <HImageEditorBulkDekstop
                            activePanel={editor.activePanel}
                            setActivePanel={editor.setActivePanel}
                            onScale={handleScale}
                            onBeforeAfter={handleBeforeAfter}
                            isPanelOpen={!isMobile}
                            anchorElZoom={editor.anchorMenuZoom}
                            onZoomMenuClose={handleZoomMenuClose}
                            onZoomAction={handleZoomAction}
                            footer={
                                <HFooter
                                    anchorElZoom={editor.anchorMenuZoom}
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
                            tempScore={editor.tempScore}
                            onTempChange={editor.setTempScore}
                            tintScore={editor.tintScore}
                            onTintChange={editor.setTintScore}
                            saturationScore={editor.saturationScore}
                            onSaturationChange={editor.setSaturationScore}
                            exposureScore={editor.exposureScore}
                            onExposureChange={editor.setExposureScore}
                            highlightsScore={editor.highlightsScore}
                            onHighlightsChange={editor.setHighlightsScore}
                            shadowScore={editor.shadowsScore}
                            onShadowsChange={editor.setShadowsScore}
                            whiteScore={editor.whitesScore}
                            onWhitesChange={editor.setWhitesScore}
                            blackScore={editor.blacksScore}
                            onBlacksChange={editor.setBlacksScore}
                            contrastScore={editor.contrastScore}
                            onContrastChange={editor.setContrastScore}
                            clarityScore={editor.clarityScore}
                            onClarityChange={editor.setClarityScore}
                            sharpnessScore={editor.sharpnessScore}
                            onSharpnessChange={editor.setSharpnessScore}
                            onOpenPresetModal={editor.handleOpenPresetModalMobile}
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
                            tempScore={editor.tempScore}
                            onTempChange={editor.setTempScore}
                            tintScore={editor.tintScore}
                            onTintChange={editor.setTintScore}
                            saturationScore={editor.saturationScore}
                            onSaturationChange={editor.setSaturationScore}
                            exposureScore={editor.exposureScore}
                            onExposureChange={editor.setExposureScore}
                            highlightsScore={editor.highlightsScore}
                            onHighlightsChange={editor.setHighlightsScore}
                            shadowsScore={editor.shadowsScore}
                            onShadowsChange={editor.setShadowsScore}
                            whitesScore={editor.whitesScore}
                            onWhitesChange={editor.setWhitesScore}
                            blacksScore={editor.blacksScore}
                            onBlacksChange={editor.setBlacksScore}
                            contrastScore={editor.contrastScore}
                            onContrastChange={editor.setContrastScore}
                            clarityScore={editor.clarityScore}
                            onClarityChange={editor.setClarityScore}
                            sharpnessScore={editor.sharpnessScore}
                            onSharpnessChange={editor.setSharpnessScore}
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
                        onRename={editor.handleRenamePreset}
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
        </>
    )
}