'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { SelectChangeEvent } from "@mui/material";
import { HonchoEditor } from '@/lib/editor/honcho-editor';

// Augment the global window object for the WASM Module
declare global {
  interface Window {
    Module: any;
  }
}

type AdjustmentState = {
    tempScore: number;
    tintScore: number;
    exposureScore: number;
    highlightsScore: number;
    shadowsScore: number;
    whitesScore: number;
    blacksScore: number;
    saturationScore: number;
    contrastScore: number;
    clarityScore: number;
    sharpnessScore: number;
};

type Preset = {
    id: string;
    name: string;
}

const initialAdjustments: AdjustmentState = {
    tempScore: 0, tintScore: 0, exposureScore: 0, highlightsScore: 0, shadowsScore: 0,
    whitesScore: 0, blacksScore: 0, saturationScore: 0, contrastScore: 0, clarityScore: 0, sharpnessScore: 0,
};

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export function useHonchoEditor() {
    // MARK: - Tokens and API Keys or hit
    // This is will implemented after backend is ready.
    const onGetTokken = () => {
        console.log("Get Token button clicked!");
        // Implement the logic to get the token here
    }

    const onImageId = () => {
        console.log("Image ID button clicked!");
        // Implement the logic to get the image ID here
    }

    const [presets, setPresets] = useState<Preset[]>([
        { id: 'preset1', name: 'My Preset 1' },
        { id: 'preset2', name: 'My Preset 2' },
        { id: 'preset3', name: 'My Preset 3' },
    ]);

    // MARK: - Core Editor State & Refs
    const editorRef = useRef<HonchoEditor | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [editorStatus, setEditorStatus] = useState("Initializing...");
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // MARK: - Adjustment & History State
    const [adjustments, setAdjustments] = useState<AdjustmentState>(initialAdjustments);
    const [history, setHistory] = useState<AdjustmentState[]>([initialAdjustments]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [copiedAdjustments, setCopiedAdjustments] = useState<AdjustmentState | null>(null);

    // Individual Adjustment State
    const [tempScore, setTempScore] = useState(0);
    const [tintScore, setTintScore] = useState(0);
    const [exposureScore, setExposureScore] = useState(0);
    const [highlightsScore, setHighlightsScore] = useState(0);
    const [shadowsScore, setShadowsScore] = useState(0);
    const [whitesScore, setWhitesScore] = useState(0);
    const [blacksScore, setBlacksScore] = useState(0);
    const [saturationScore, setSaturationScore] = useState(0);
    const [contrastScore, setContrastScore] = useState(0);
    const [clarityScore, setClarityScore] = useState(0);
    const [sharpnessScore, setSharpnessScore] = useState(0);

    // MARK: - UI & App State (Moved from page.tsx)
    // General UI State
    const [isOnline, setIsOnline] = useState(true);
    const [showCopyAlert, setShowCopyAlert] = useState(false);
    const [isCopyDialogOpen, setCopyDialogOpen] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [activePanel, setActivePanel] = useState('colorAdjustment');
    const [activeSubPanel, setActiveSubPanel] = useState('');
    const [headerMenuAnchorEl, setHeaderMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorMenuZoom, setAnchorMenuZoom] = useState<null | HTMLElement>(null);

    // Panel Expansion State
    const [colorAdjustmentExpandedPanels, setColorAdjustmentExpandedPanels] = useState<string[]>(['whiteBalance']);
    const [presetExpandedPanels, setPresetExpandedPanels] = useState<string[]>(['preset']);

    // Watermark State
    const [isCreatingWatermark, setIsCreatingWatermark] = useState(false);

    // Preset State
    const [isPresetModalOpen, setPresetModalOpen] = useState(false);
    const [isPresetModalOpenMobile, setPresetModalOpenMobile] = useState(false);
    const [presetName, setPresetName] = useState("Type Here");
    const [isPresetCreated, setIsPresetCreated] = useState(false);
    const [selectedMobilePreset, setSelectedMobilePreset] = useState<string | null>('preset1');
    const [selectedDesktopPreset, setSelectedDesktopPreset] = useState<string | null>('preset1');
    const [selectedBulkPreset, setSelectedBulkPreset] = useState<string>('preset1');
    const [presetMenuAnchorEl, setPresetMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [activePresetMenuId, setActivePresetMenuId] = useState<string | null>(null);

    // Aspect Ratio State
    const [currentAspectRatio, setCurrentAspectRatio] = useState('potrait');
    const [currentSquareRatio, setCurrentSquareRatio] = useState('original');
    const [currentWideRatio, setCurrentWideRatio] = useState('1:1');
    const [angelScore, setAngleScore] = useState(0);
    const [widthSizePX, setWidthSizePX] = useState(0);
    const [heightSizePX, setHeightSizePX] = useState(0);

    // Bulk Editing State
    const [isBulkEditing, setIsBulkEditing] = useState(false);
    const [selectedImages, setSelectedImages] = useState('Select');

    // State for Copying specific adjustments
    const [colorAdjustments, setColorAdjustments] = useState(true);
    const [lightAdjustments, setLightAdjustments] = useState(true);
    const [detailsAdjustments, setDetailsAdjustments] = useState(true);

    // Mobile Draggable Panel State
    const [panelHeight, setPanelHeight] = useState(165);
    const [contentHeight, setContentHeight] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef(0);
    const initialHeight = useRef(0);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    // MARK: - Core Editor Logic
    const setAdjustment = useCallback(<K extends keyof AdjustmentState>(key: K, value: AdjustmentState[K]) => {
        setAdjustments(prev => ({ ...prev, [key]: value }));
    }, []);

    const adjustClarity = useCallback((uiAmount: number) => {
        setAdjustment('clarityScore', clamp((adjustments.clarityScore * 100 + uiAmount) / 100));
    }, [adjustments.clarityScore, setAdjustment]);

    const adjustSharpness = useCallback((uiAmount: number) => {
        setAdjustment('sharpnessScore', clamp((adjustments.sharpnessScore * 100 + uiAmount) / 100));
    }, [adjustments.sharpnessScore, setAdjustment]);

    const handleScriptReady = useCallback(async () => {
        if (typeof window.Module === 'function' && !editorRef.current) {
            try {
                setEditorStatus("Loading WASM module...");
                const editor = new HonchoEditor();
                await editor.initialize();
                editorRef.current = editor;
                setIsEditorReady(true);
                setEditorStatus("Ready! Select an image to start.");
            } catch (error) {
                console.error("Editor initialization failed:", error);
                setEditorStatus("Error: Could not load editor.");
            }
        }
    }, []);

    const updateCanvas = useCallback(() => {
        if (editorRef.current?.getInitialized() && canvasRef.current) {
            editorRef.current.processImage();
            editorRef.current.renderToCanvas(canvasRef.current);
        }
    }, []);

    const loadImage = useCallback(async (file: File) => {
        if (!editorRef.current) {
            setEditorStatus("Editor not ready.");
            return;
        }
        setEditorStatus("Loading image...");
        try {
            await editorRef.current.loadImageFromFile(file);
            setIsImageLoaded(true);
        } catch (e) {
            console.error("Error loading image:", e);
            setEditorStatus("Error: Could not load the image.");
            setIsImageLoaded(false);
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) loadImage(file);
    };

    const applyAdjustmentState = useCallback((state: AdjustmentState) => {
        setTempScore(state.tempScore);
        setTintScore(state.tintScore);
        setExposureScore(state.exposureScore);
        setHighlightsScore(state.highlightsScore);
        setShadowsScore(state.shadowsScore);
        setWhitesScore(state.whitesScore);
        setBlacksScore(state.blacksScore);
        setSaturationScore(state.saturationScore);
        setContrastScore(state.contrastScore);
        setClarityScore(state.clarityScore);
        setSharpnessScore(state.sharpnessScore);
    }, []);

    const handleRevert = useCallback(() => {
        if (!editorRef.current) return;
        editorRef.current.resetAdjustments();
        applyAdjustmentState(initialAdjustments);
    }, [applyAdjustmentState]);

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            applyAdjustmentState(history[prevIndex]);
            setHistoryIndex(prevIndex);
        }
    }, [history, historyIndex, applyAdjustmentState]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            applyAdjustmentState(history[nextIndex]);
            setHistoryIndex(nextIndex);
        }
    }, [history, historyIndex, applyAdjustmentState]);

    // MARK: - UI Handlers (Moved from page.tsx)
    // Header and Dialog Handlers
    const handleHeaderMenuClick = (event: React.MouseEvent<HTMLElement>) => setHeaderMenuAnchorEl(event.currentTarget);
    const handleHeaderMenuClose = () => setHeaderMenuAnchorEl(null);
    const handleOpenCopyDialog = () => { setCopyDialogOpen(true); handleHeaderMenuClose(); };
    const handleCloseCopyDialog = () => setCopyDialogOpen(false);

    const handleCopyEdit = useCallback(() => {
        const currentState: AdjustmentState = { tempScore, tintScore, exposureScore, highlightsScore, shadowsScore, whitesScore, blacksScore, saturationScore, contrastScore, clarityScore, sharpnessScore };
        setCopiedAdjustments(currentState);
        console.log("Copied current adjustments:", currentState);
    }, [tempScore, tintScore, exposureScore, highlightsScore, shadowsScore, whitesScore, blacksScore, saturationScore, contrastScore, clarityScore, sharpnessScore]);

    const handleConfirmCopy = () => { handleCopyEdit(); handleCloseCopyDialog(); setShowCopyAlert(true); };

    const handlePasteEdit = useCallback(() => {
        if (copiedAdjustments) {
            applyAdjustmentState(copiedAdjustments);
        }
    }, [copiedAdjustments, applyAdjustmentState]);

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

    // Panel Handlers
    const handleColorAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setColorAdjustmentExpandedPanels(prev => isExpanded ? [...new Set([...prev, panel])] : prev.filter(p => p !== panel));
    };
    const handlePresetAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setPresetExpandedPanels(prev => isExpanded ? [...new Set([...prev, panel])] : prev.filter(p => p !== panel));
    };

    // Preset Handlers
    const handleSelectMobilePreset = (presetId: string) => setSelectedMobilePreset(presetId);
    const handleSelectDesktopPreset = (presetId: string) => setSelectedDesktopPreset(presetId);
    const handlePresetMenuClick = (event: React.MouseEvent<HTMLElement>, presetId: string) => {
        event.stopPropagation();
        setPresetMenuAnchorEl(event.currentTarget);
        setActivePresetMenuId(presetId);
    };
    const handlePresetMenuClose = () => { setPresetMenuAnchorEl(null); setActivePresetMenuId(null); };
    const handleRemovePreset = () => { console.log(`Remove: ${activePresetMenuId}`); handlePresetMenuClose(); };
    const handleRenamePreset = () => { console.log(`Rename: ${activePresetMenuId}`); handlePresetMenuClose(); };
    const handleDeletePreset = () => {
        if (!activePresetMenuId) return;
        console.log(`Delete: ${activePresetMenuId}`);
        setPresets(prevPresets => prevPresets.filter(p => p.id !== activePresetMenuId));
        handlePresetMenuClose();
    };

    // Preset Modal Handlers
    const handleOpenPresetModal = () => { setIsPresetCreated(false); setPresetModalOpen(true); };
    const handleClosePresetModal = () => setPresetModalOpen(false);
    const handleCreatePreset = () => {
        console.log("Creating preset:", presetName);
        const newPreset = { id: `preset${presets.length + 1}`, name: presetName };
        setPresets(prevPresets => [...prevPresets, newPreset]);

        setIsPresetCreated(true);
        handleClosePresetModal();
        setTimeout(() => setIsPresetCreated(false), 1000);
    };
    const handleOpenPresetModalMobile = () => { setIsPresetCreated(false); setPresetModalOpenMobile(true); };
    const handleClosePresetModalMobile = () => setPresetModalOpenMobile(false);
    const handleCreatePresetMobile = () => {
        console.log("Creating mobile preset:", presetName);
        const newPreset = { id: `preset${presets.length + 1}`, name: presetName };
        setPresets(prevPresets => [...prevPresets, newPreset]);
        setIsPresetCreated(true);
        handleClosePresetModalMobile();
        setTimeout(() => setIsPresetCreated(false), 1000);
    };
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setPresetName(event.target.value);

    // Watermark Handlers
    const handleOpenWatermarkView = () => setIsCreatingWatermark(true);
    const handleSaveWatermark = () => setIsCreatingWatermark(false);
    const handleCancelWatermark = () => setIsCreatingWatermark(false);

    // Bulk Editing Handlers
    const toggleBulkEditing = () => {
        setIsBulkEditing(prev => {
            const isNowBulk = !prev;
            setSelectedImages(isNowBulk ? 'Selected' : 'Select');
            return isNowBulk;
        });
    };
    const handleSelectBulkPreset = (event: SelectChangeEvent<string>) => setSelectedBulkPreset(event.target.value as string);

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
        const panelChromeHeight = 60;
        const dynamicPanelFullHeight = contentHeight + panelChromeHeight;
        const clampedHeight = Math.max(165, Math.min(newHeight, dynamicPanelFullHeight));
        setPanelHeight(clampedHeight);
    }, [isDragging, contentHeight]);

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        dragStartPos.current = 0;
        if (panelRef.current) panelRef.current.style.transition = 'height 0.3s ease-in-out';
        const panelChromeHeight = 60;
        const dynamicPanelFullHeight = contentHeight + panelChromeHeight;
        const halfwayPoint = (dynamicPanelFullHeight + 165) / 2;
        setPanelHeight(panelHeight > halfwayPoint ? dynamicPanelFullHeight : 165);
    }, [isDragging, panelHeight, contentHeight]);

    // MARK: - Effects
    useEffect(() => { if (isImageLoaded) { editorRef.current?.setExposure(exposureScore); updateCanvas(); } }, [exposureScore, isImageLoaded, updateCanvas]);
    useEffect(() => { if (isImageLoaded) { editorRef.current?.setContrast(contrastScore); updateCanvas(); } }, [contrastScore, isImageLoaded, updateCanvas]);
    useEffect(() => { if (isImageLoaded) { editorRef.current?.setHighlights(highlightsScore); updateCanvas(); } }, [highlightsScore, isImageLoaded, updateCanvas]);
    useEffect(() => { if (isImageLoaded) { editorRef.current?.setShadows(shadowsScore); updateCanvas(); } }, [shadowsScore, isImageLoaded, updateCanvas]);
    useEffect(() => { if (isImageLoaded) { editorRef.current?.setSaturation(saturationScore); updateCanvas(); } }, [saturationScore, isImageLoaded, updateCanvas]);
    useEffect(() => { if (isImageLoaded) { editorRef.current?.setTemperature(tempScore); updateCanvas(); } }, [tempScore, isImageLoaded, updateCanvas]);
    useEffect(() => { if (isImageLoaded) { editorRef.current?.setTint(tintScore); updateCanvas(); } }, [tintScore, isImageLoaded, updateCanvas]);
    useEffect(() => { if (isImageLoaded) { editorRef.current?.setBlacks(blacksScore); updateCanvas(); } }, [blacksScore, isImageLoaded, updateCanvas]);
    useEffect(() => { if (isImageLoaded) { editorRef.current?.setWhites(whitesScore); updateCanvas(); } }, [whitesScore, isImageLoaded, updateCanvas]);
    useEffect(() => { if (isImageLoaded) { editorRef.current?.setClarity(clarityScore); updateCanvas(); } }, [clarityScore, isImageLoaded, updateCanvas]);
    useEffect(() => { if (isImageLoaded) { editorRef.current?.setSharpness(sharpnessScore); updateCanvas(); } }, [sharpnessScore, isImageLoaded, updateCanvas]);

    useEffect(() => {
        if (isImageLoaded && editorRef.current && canvasRef.current) {
            const { width, height } = editorRef.current.getImageSize();
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            updateCanvas();
            setEditorStatus("Image loaded successfully!");
        }
    }, [isImageLoaded, updateCanvas]);

    useEffect(() => {
        if (!isImageLoaded) return;
        const newState: AdjustmentState = { tempScore, tintScore, exposureScore, highlightsScore, shadowsScore, whitesScore, blacksScore, saturationScore, contrastScore, clarityScore, sharpnessScore };
        if (JSON.stringify(history[historyIndex]) === JSON.stringify(newState)) return;
        const newHistory = history.slice(0, historyIndex + 1);
        setHistory([...newHistory, newState]);
        setHistoryIndex(newHistory.length);
    }, [tempScore, tintScore, exposureScore, highlightsScore, shadowsScore, whitesScore, blacksScore, saturationScore, contrastScore, clarityScore, sharpnessScore, isImageLoaded, history, historyIndex]);

    // Effects moved from page.tsx
    useEffect(() => {
        if (showCopyAlert) {
            const timer = setTimeout(() => setShowCopyAlert(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showCopyAlert]);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

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

    return {
        // Refs
        canvasRef,
        fileInputRef,
        panelRef,
        contentRef,

        // Status & State
        editorStatus,
        isEditorReady,
        isImageLoaded,
        isPasteAvailable: copiedAdjustments !== null,
        isOnline,
        showCopyAlert,
        isCopyDialogOpen,
        isPublished,
        activePanel,
        activeSubPanel,
        headerMenuAnchorEl,
        anchorMenuZoom,
        colorAdjustmentExpandedPanels,
        presetExpandedPanels,
        isCreatingWatermark,
        isPresetModalOpen,
        isPresetModalOpenMobile,
        presetName,
        isPresetCreated,
        selectedMobilePreset,
        selectedDesktopPreset,
        selectedBulkPreset,
        presetMenuAnchorEl,
        activePresetMenuId,
        currentAspectRatio,
        currentSquareRatio,
        currentWideRatio,
        angelScore,
        widthSizePX,
        heightSizePX,
        isBulkEditing,
        selectedImages,
        colorAdjustments,
        lightAdjustments,
        detailsAdjustments,
        panelHeight,
        presets,

        // Functions
        handleScriptReady,
        handleFileChange,
        handleRevert,
        handleUndo,
        handleRedo,
        handleCopyEdit,
        handlePasteEdit,
        handleBack,
        adjustClarity,
        adjustSharpness,

        // Setters & Handlers
        setActivePanel,
        setActiveSubPanel,
        setHeaderMenuAnchorEl,
        setAnchorMenuZoom,
        handleHeaderMenuClick,
        handleHeaderMenuClose,
        handleOpenCopyDialog,
        handleCloseCopyDialog,
        handleConfirmCopy,
        setColorAdjustments,
        setLightAdjustments,
        setDetailsAdjustments,
        handleColorAccordionChange,
        handlePresetAccordionChange,
        handleSelectMobilePreset,
        handleSelectDesktopPreset,
        handlePresetMenuClick,
        handlePresetMenuClose,
        handleRemovePreset,
        handleRenamePreset,
        handleDeletePreset,
        handleOpenPresetModal,
        handleClosePresetModal,
        handleCreatePreset,
        handleOpenPresetModalMobile,
        handleClosePresetModalMobile,
        handleCreatePresetMobile,
        setPresetName,
        handleNameChange,
        handleOpenWatermarkView,
        handleSaveWatermark,
        handleCancelWatermark,
        toggleBulkEditing,
        handleSelectBulkPreset,
        handleDragStart,
        handleContentHeightChange,

        // Adjustment State & Setters
        tempScore,
        setTempScore,
        tintScore,
        setTintScore,
        exposureScore,
        setExposureScore,
        highlightsScore,
        setHighlightsScore,
        shadowsScore,
        setShadowsScore,
        whitesScore,
        setWhitesScore,
        blacksScore,
        setBlacksScore,
        saturationScore,
        setSaturationScore,
        contrastScore,
        setContrastScore,
        clarityScore,
        setClarityScore,
        sharpnessScore,
        setSharpnessScore,
    };
}