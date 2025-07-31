'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { SelectChangeEvent } from "@mui/material";
import { HonchoEditor } from '@/lib/editor/honcho-editor';

export interface Controller {
    // Image Handling
    onGetImage(imageID: string): Promise<File | null>;
    getImageList(): Promise<ImageItem[]>;

    // syncConfig
    syncConfig(): Promise<void>;

    // Preset
    getPresets(): Promise<Preset[]>;
    createPreset(name: string, settings: AdjustmentState): Promise<Preset | null>;
    deletePreset(presetId: string): Promise<void>;
    renamePreset(presetId: string, newName: string): Promise<void>;
}

// Augment the global window object for the WASM Module
declare global {
  interface Window {
    Module: any;
  }
}

export type AdjustmentState = {
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

export type Preset = {
    id: string;
    name: string;
}

// Bulk Image List

export type ImageItem = {
    id: string;
    url: string;
    name: string;
};

const initialAdjustments: AdjustmentState = {
    tempScore: 0, tintScore: 0, exposureScore: 0, highlightsScore: 0, shadowsScore: 0,
    whitesScore: 0, blacksScore: 0, saturationScore: 0, contrastScore: 0, clarityScore: 0, sharpnessScore: 0,
};

const clamp = (value: number) => Math.max(-100, Math.min(100, value));

export function useHonchoEditor(controller: Controller) {
    // MARK: - Core Editor State & Refs
    const editorRef = useRef<HonchoEditor | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasContainerRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [editorStatus, setEditorStatus] = useState("Initializing...");
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    // MARK: - Adjustment & History State
    // const [adjustments, setAdjustments] = useState<AdjustmentState>(initialAdjustments);
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
    const [presets, setPresets] = useState<Preset[]>([]);
    const [presetName, setPresetName] = useState("Type Here");
    const [isPresetCreated, setIsPresetCreated] = useState(false);
    const [selectedMobilePreset, setSelectedMobilePreset] = useState<string | null>('preset1');
    const [selectedDesktopPreset, setSelectedDesktopPreset] = useState<string | null>('preset1');
    const [selectedBulkPreset, setSelectedBulkPreset] = useState<string>('preset1');
    const [presetMenuAnchorEl, setPresetMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [activePresetMenuId, setActivePresetMenuId] = useState<string | null>(null);
    const [isRenameModalOpen, setRenameModalOpen] = useState(false);
    const [presetToRename, setPresetToRename] = useState<Preset | null>(null);
    const [newPresetName, setNewPresetName] = useState("");

    // Aspect Ratio State
    // Note: not used yet
    const [currentAspectRatio, setCurrentAspectRatio] = useState('potrait');
    const [currentSquareRatio, setCurrentSquareRatio] = useState('original');
    const [currentWideRatio, setCurrentWideRatio] = useState('1:1');
    const [angelScore, setAngleScore] = useState(0);
    const [widthSizePX, setWidthSizePX] = useState(0);
    const [heightSizePX, setHeightSizePX] = useState(0);

    // Bulk Editing State
    const [isBulkEditing, setIsBulkEditing] = useState(false);
    const [selectedImages, setSelectedImages] = useState('Select');
    const [imageList, setImageList] = useState<ImageItem[]>([]);
    const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());
    const [primaryImageId, setPrimaryImageId] = useState<string | null>(null);

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

    const loadImageFromId = useCallback(async (imageId: string) => {
        if (!controller) {
            console.error("Controller not provided to useHonchoEditor hook.");
            setEditorStatus("Error: Controller is missing.");
            return;
        }

        console.log(`Fetching image for ID: ${imageId}`);
        setEditorStatus("Fetching image from source...");
        
        try {
            const imageFile = await controller.onGetImage(imageId);
            
            if (imageFile) {
                await loadImage(imageFile);
                 // Optional: Communicate back to native environments
                if ((window as any).webkit?.messageHandlers?.nativeHandler) {
                    (window as any).webkit.messageHandlers.nativeHandler.postMessage({ status: 'imageLoaded', id: imageId });
                } else if ((window as any).Android?.onImageLoaded) {
                    (window as any).Android.onImageLoaded(imageId);
                }
            } else {
                throw new Error("Controller did not return an image file.");
            }
        } catch (error) {
            console.error("Failed to fetch or load image via controller:", error);
            setEditorStatus("Error: Could not fetch the image.");
            setIsImageLoaded(false);
        }
    }, [controller, loadImage]);

    const fetchImageList = useCallback(async () => {
        if (!controller) return;
        try {
            const images = await controller.getImageList();
            setImageList(images);
        } catch (error) {
            console.error("Failed to fetch image list:", error);
        }
    }, [controller]);

    const handleToggleImageSelection = useCallback((imageId: string) => {
        setSelectedImageIds(prevSelectedIds => {
            const newSelectedIds = new Set(prevSelectedIds);
            if (newSelectedIds.has(imageId)) {
                newSelectedIds.delete(imageId);
            } else {
                newSelectedIds.add(imageId);
            }
            console.log("Selected IDs:", Array.from(newSelectedIds)); // For debugging
            return newSelectedIds;
        });
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

    // MARK: - Bulk Editor Functions For Desktop and Mobile
    const adjustTempBulk = useCallback((uiAmount: number) => {
        setTempScore(prevScore => {
            const newScore = clamp(prevScore + uiAmount);
            console.log("Adjusting temperature. New score:", newScore);
            return newScore;
        });
    }, []);

    const adjustTintBulk = useCallback((uiAmount: number) => {
        setTintScore(prevScore => {
            const newScore = clamp(prevScore + uiAmount);
            console.log("Adjusting tint. New score:", newScore);
            return newScore;
        });
    }, []);

    const adjustSaturationBulk = useCallback((uiAmount: number) => {
        setSaturationScore(prevScore => {
            const newScore = clamp(prevScore + uiAmount);
            console.log("Adjusting saturation. New score:", newScore);
            return newScore;
        });
    }, []);

    const adjustExposureBulk = useCallback((uiAmount: number) => {
        setExposureScore(prevScore => {
            const newScore = clamp(prevScore + uiAmount);
            console.log("Adjusting exposure. New score:", newScore);
            return newScore;
        });
    }, []);

    const adjustContrastBulk = useCallback((uiAmount: number) => {
        setContrastScore(prevScore => {
            const newScore = clamp(prevScore + uiAmount);
            console.log("Adjusting contrast. New score:", newScore);
            return newScore;
        });
    }, []);

    const adjustHighlightsBulk = useCallback((uiAmount: number) => {
        setHighlightsScore(prevScore => {
            const newScore = clamp(prevScore + uiAmount);
            console.log("Adjusting highlights. New score:", newScore);
            return newScore;
        });
    }, []);

    const adjustShadowsBulk = useCallback((uiAmount: number) => {
        setShadowsScore(prevScore => {
            const newScore = clamp(prevScore + uiAmount);
            console.log("Adjusting shadows. New score:", newScore);
            return newScore;
        });
    }, []);

    const adjustWhitesBulk = useCallback((uiAmount: number) => {
        setWhitesScore(prevScore => {
            const newScore = clamp(prevScore + uiAmount);
            console.log("Adjusting whites. New score:", newScore);
            return newScore;
        });
    }, []);

    const adjustBlacksBulk = useCallback((uiAmount: number) => {
        setBlacksScore(prevScore => {
            const newScore = clamp(prevScore + uiAmount);
            console.log("Adjusting blacks. New score:", newScore);
            return newScore;
        });
    }, []);

    const adjustClarityBulk = useCallback((uiAmount: number) => {
        setClarityScore(prevScore => {
            const newScore = clamp(prevScore + uiAmount);
            console.log("Adjusting clarity. New score:", newScore);
            return newScore;
        });
    }, []);

    const adjustSharpnessBulk = useCallback((uiAmount: number) => {
        setSharpnessScore(prevScore => {
            const newScore = clamp(prevScore + uiAmount);
            console.log("Adjusting sharpness. New score:", newScore);
            return newScore;
        });
    }, []);

    const handleBulkTempDecreaseMax = useCallback(() => adjustTempBulk(-100), [adjustTempBulk]);
    const handleBulkTempDecrease = useCallback(() => adjustTempBulk(-1), [adjustTempBulk]);
    const handleBulkTempIncrease = useCallback(() => adjustTempBulk(1), [adjustTempBulk]);
    const handleBulkTempIncreaseMax = useCallback(() => adjustTempBulk(100), [adjustTempBulk]);

    const handleBulkTintDecreaseMax = useCallback(() => adjustTintBulk(-100), [adjustTintBulk]);
    const handleBulkTintDecrease = useCallback(() => adjustTintBulk(-1), [adjustTintBulk]);
    const handleBulkTintIncrease = useCallback(() => adjustTintBulk(1), [adjustTintBulk]);
    const handleBulkTintIncreaseMax = useCallback(() => adjustTintBulk(100), [adjustTintBulk]);

    const handleBulkSaturationDecreaseMax = useCallback(() => adjustSaturationBulk(-100), [adjustSaturationBulk]);
    const handleBulkSaturationDecrease = useCallback(() => adjustSaturationBulk(-1), [adjustSaturationBulk]);
    const handleBulkSaturationIncrease = useCallback(() => adjustSaturationBulk(1), [adjustSaturationBulk]);
    const handleBulkSaturationIncreaseMax = useCallback(() => adjustSaturationBulk(100), [adjustSaturationBulk]);

    const handleBulkExposureDecreaseMax = useCallback(() => adjustExposureBulk(-100), [adjustExposureBulk]);
    const handleBulkExposureDecrease = useCallback(() => adjustExposureBulk(-1), [adjustExposureBulk]);
    const handleBulkExposureIncrease = useCallback(() => adjustExposureBulk(1), [adjustExposureBulk]);
    const handleBulkExposureIncreaseMax = useCallback(() => adjustExposureBulk(100), [adjustExposureBulk]);

    const handleBulkContrastDecreaseMax = useCallback(() => adjustContrastBulk(-100), [adjustContrastBulk]);
    const handleBulkContrastDecrease = useCallback(() => adjustContrastBulk(-1), [adjustContrastBulk]);
    const handleBulkContrastIncrease = useCallback(() => adjustContrastBulk(1), [adjustContrastBulk]);
    const handleBulkContrastIncreaseMax = useCallback(() => adjustContrastBulk(100), [adjustContrastBulk]);

    const handleBulkHighlightsDecreaseMax = useCallback(() => adjustHighlightsBulk(-100), [adjustHighlightsBulk]);
    const handleBulkHighlightsDecrease = useCallback(() => adjustHighlightsBulk(-1), [adjustHighlightsBulk]);
    const handleBulkHighlightsIncrease = useCallback(() => adjustHighlightsBulk(1), [adjustHighlightsBulk]);
    const handleBulkHighlightsIncreaseMax = useCallback(() => adjustHighlightsBulk(100), [adjustHighlightsBulk]);

    const handleBulkShadowsDecreaseMax = useCallback(() => adjustShadowsBulk(-100), [adjustShadowsBulk]);
    const handleBulkShadowsDecrease = useCallback(() => adjustShadowsBulk(-1), [adjustShadowsBulk]);
    const handleBulkShadowsIncrease = useCallback(() => adjustShadowsBulk(1), [adjustShadowsBulk]);
    const handleBulkShadowsIncreaseMax = useCallback(() => adjustShadowsBulk(100), [adjustShadowsBulk]);

    const handleBulkWhitesDecreaseMax = useCallback(() => adjustWhitesBulk(-100), [adjustWhitesBulk]);
    const handleBulkWhitesDecrease = useCallback(() => adjustWhitesBulk(-1), [adjustWhitesBulk]);
    const handleBulkWhitesIncrease = useCallback(() => adjustWhitesBulk(1), [adjustWhitesBulk]);
    const handleBulkWhitesIncreaseMax = useCallback(() => adjustWhitesBulk(100), [adjustWhitesBulk]);

    const handleBulkBlacksDecreaseMax = useCallback(() => adjustBlacksBulk(-100), [adjustBlacksBulk]);
    const handleBulkBlacksDecrease = useCallback(() => adjustBlacksBulk(-1), [adjustBlacksBulk]);
    const handleBulkBlacksIncrease = useCallback(() => adjustBlacksBulk(1), [adjustBlacksBulk]);
    const handleBulkBlacksIncreaseMax = useCallback(() => adjustBlacksBulk(100), [adjustBlacksBulk]);

    const handleBulkClarityDecreaseMax = useCallback(() => adjustClarityBulk(-100), [adjustClarityBulk]);
    const handleBulkClarityDecrease = useCallback(() => adjustClarityBulk(-1), [adjustClarityBulk]);
    const handleBulkClarityIncrease = useCallback(() => adjustClarityBulk(1), [adjustClarityBulk]);
    const handleBulkClarityIncreaseMax = useCallback(() => adjustClarityBulk(100), [adjustClarityBulk]);

    const handleBulkSharpnessDecreaseMax = useCallback(() => adjustSharpnessBulk(-100), [adjustSharpnessBulk]);
    const handleBulkSharpnessDecrease = useCallback(() => adjustSharpnessBulk(-1), [adjustSharpnessBulk]);
    const handleBulkSharpnessIncrease = useCallback(() => adjustSharpnessBulk(1), [adjustSharpnessBulk]);
    const handleBulkSharpnessIncreaseMax = useCallback(() => adjustSharpnessBulk(100), [adjustSharpnessBulk]);

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

    // MARK: - Preset Handlers
    // Also it calls for the backend endpoint
    const fetchPresets = useCallback(async () => {
        if (!controller) return;
        try {
            const fetchedPresets = await controller.getPresets();
            setPresets(fetchedPresets);
        } catch (error) {
            console.error("Failed to fetch presets:", error);
        }
    }, [controller]);
    const handleSelectMobilePreset = (presetId: string) => setSelectedMobilePreset(presetId);
    const handleSelectDesktopPreset = (presetId: string) => setSelectedDesktopPreset(presetId);
    const handlePresetMenuClick = (event: React.MouseEvent<HTMLElement>, presetId: string) => {
        event.stopPropagation();
        setPresetMenuAnchorEl(event.currentTarget);
        setActivePresetMenuId(presetId);
    };
    const handlePresetMenuClose = () => { setPresetMenuAnchorEl(null); setActivePresetMenuId(null); };
    const handleRemovePreset = () => { console.log(`Remove: ${activePresetMenuId}`); handlePresetMenuClose(); };
    
    const handleRenamePreset = useCallback(async (newName: string) => {
        if (!controller || !activePresetMenuId) return;

        try {
            await controller.renamePreset(activePresetMenuId, newName);
            // On success, update the preset in local state
            setPresets(prev => prev.map(p => 
                p.id === activePresetMenuId ? { ...p, name: newName } : p
            ));
        } catch (error) {
            console.error("Failed to rename preset:", error);
        }
        
        handlePresetMenuClose();
    }, [controller, activePresetMenuId]);

    const handleDeletePreset = useCallback(async () => {
        if (!controller || !activePresetMenuId) return;
        
        try {
            await controller.deletePreset(activePresetMenuId);
            // On success, remove the preset from local state
            setPresets(prevPresets => prevPresets.filter(p => p.id !== activePresetMenuId));
        } catch (error) {
            console.error("Failed to delete preset:", error);
        }
        
        handlePresetMenuClose(); // Close the options menu
    }, [controller, activePresetMenuId]);

    // Preset Modal Handlers
    const handleOpenPresetModal = () => { setIsPresetCreated(false); setPresetModalOpen(true); };
    const handleClosePresetModal = () => setPresetModalOpen(false);

    const handleCreatePreset = useCallback(async () => {
        if (!controller) return;

        const currentAdjustments: AdjustmentState = { tempScore, tintScore, exposureScore, highlightsScore, shadowsScore, whitesScore, blacksScore, saturationScore, contrastScore, clarityScore, sharpnessScore };

        try {
            const newPreset = await controller.createPreset(presetName, currentAdjustments);
            if (newPreset) {
                // Add the new preset returned from the API to our local state
                setPresets(prevPresets => [...prevPresets, newPreset]);
            }
        } catch (error) {
            console.error("Failed to create preset:", error);
        }

        console.log("Creating preset:", presetName);
        const newPreset = { id: `preset${presets.length + 1}`, name: presetName };
        setPresets(prevPresets => [...prevPresets, newPreset]);

        setIsPresetCreated(true);
        handleClosePresetModal();
        setTimeout(() => setIsPresetCreated(false), 1000);
    }, [controller, presetName, tempScore, tintScore, exposureScore, highlightsScore, shadowsScore, whitesScore, blacksScore, saturationScore, contrastScore, clarityScore, sharpnessScore]);

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

    const handleOpenRenameModal = useCallback(() => {
        if (!activePresetMenuId) return;
        const preset = presets.find(p => p.id === activePresetMenuId);
        if (preset) {
            setPresetToRename(preset);
            setNewPresetName(preset.name); // Pre-fill the input with the current name
            setRenameModalOpen(true);
        }
        handlePresetMenuClose(); // Close the small options menu
    }, [activePresetMenuId, presets]);

    const handleCloseRenameModal = () => {
        setRenameModalOpen(false);
        setPresetToRename(null);
        setNewPresetName("");
    };

    const handleConfirmRename = useCallback(async () => {
        if (!presetToRename || !newPresetName) return;

        try {
            await controller.renamePreset(presetToRename.id, newPresetName);
            // On success, update the preset in local state
            setPresets(prev => prev.map(p =>
                p.id === presetToRename.id ? { ...p, name: newPresetName } : p
            ));
        } catch (error) {
            console.error("Failed to rename preset:", error);
        }
        
        handleCloseRenameModal();
    }, [controller, presetToRename, newPresetName]);

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

    // MARK: - Zoom Handlers
    const handleZoomAction = useCallback((action: string) => {
        let newZoom = zoomLevel;
        const zoomStep = 1.25;

        switch (action) {
            case 'in':
                newZoom *= zoomStep;
                break;
            case 'out':
                newZoom /= zoomStep;
                break;
            case 'fit':
                newZoom = 1;
                break;
            case '50%':
                newZoom = 0.5;
                break;
            case '100%':
                newZoom = 1;
                break;
            case '200%':
                newZoom = 2;
                break;
        }
        setZoomLevel(Math.max(0.1, Math.min(newZoom, 8)));
    }, [zoomLevel]);

    const handleWheelZoom = useCallback((event: React.WheelEvent) => {
        if (!isImageLoaded) return;
        event.preventDefault(); // Prevent page from scrolling

        const zoomFactor = 1.1;
        let newZoom = zoomLevel;

        if (event.deltaY < 0) {
            newZoom *= zoomFactor; // Scroll up to zoom in
        } else {
            newZoom /= zoomFactor; // Scroll down to zoom out
        }
        setZoomLevel(Math.max(0.1, Math.min(newZoom, 8)));
    }, [zoomLevel, isImageLoaded]);

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.style.transition = 'transform 0.1s ease-out';
            canvasRef.current.style.transform = `scale(${zoomLevel})`;
        }
    }, [zoomLevel]);

    // MARK: - Effects
    // Preset Image List
    useEffect(() => {
        fetchPresets();
        fetchImageList();
        if (controller) {
            controller.syncConfig();
        }
    }, [controller, fetchPresets, fetchImageList]);

    // Image Load
    useEffect(() => {
        if (isImageLoaded && editorRef.current && canvasRef.current) {
            const { width, height } = editorRef.current.getImageSize();
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            updateCanvas();
            setEditorStatus("Image loaded successfully!");
        }
    }, [isImageLoaded, updateCanvas]);

    // Adjustment USE EFFECTS
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
        if (!isImageLoaded) return;
        const newState: AdjustmentState = { tempScore, tintScore, exposureScore, highlightsScore, shadowsScore, whitesScore, blacksScore, saturationScore, contrastScore, clarityScore, sharpnessScore };
        if (JSON.stringify(history[historyIndex]) === JSON.stringify(newState)) return;
        const newHistory = history.slice(0, historyIndex + 1);
        setHistory([...newHistory, newState]);
        setHistoryIndex(newHistory.length);
    }, [tempScore, tintScore, exposureScore, highlightsScore, shadowsScore, whitesScore, blacksScore, saturationScore, contrastScore, clarityScore, sharpnessScore, isImageLoaded, history, historyIndex]);

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
        canvasContainerRef,
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
        handleWheelZoom,
        handleZoomAction,
        zoomLevelText: `${Math.round(zoomLevel * 100)}%`,
        presets,
        
        // Functions
        handleScriptReady,
        handleFileChange,
        loadImageFromId,
        handleRevert,
        handleUndo,
        handleRedo,
        handleCopyEdit,
        handlePasteEdit,
        handleBack,
        adjustClarityBulk,
        adjustSharpnessBulk,

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
        handleCreatePreset,
        handleRemovePreset,
        handleRenamePreset,
        handleDeletePreset,
        handleOpenPresetModal,
        handleClosePresetModal,
        handleOpenPresetModalMobile,
        handleClosePresetModalMobile,
        handleCreatePresetMobile,
        setPresetName,
        handleNameChange,
        isRenameModalOpen,
        presetToRename,
        newPresetName,
        setNewPresetName,
        handleOpenRenameModal,
        handleCloseRenameModal,
        handleConfirmRename,
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

        // Bulk Adjustment Handlers
        // Note: These handlers are for image list
        imageList, 
        selectedImageIds,
        handleToggleImageSelection,

        // Note: These handlers are for bulk adjustments
        // Adjustment Colors
        handleBulkTempDecreaseMax,
        handleBulkTempDecrease,
        handleBulkTempIncrease,
        handleBulkTempIncreaseMax,
        handleBulkTintDecreaseMax,
        handleBulkTintDecrease,
        handleBulkTintIncrease,
        handleBulkTintIncreaseMax,
        handleBulkSaturationDecreaseMax,
        handleBulkSaturationDecrease,
        handleBulkSaturationIncrease,
        handleBulkSaturationIncreaseMax,
        // Adjustment Light
        handleBulkExposureDecreaseMax,
        handleBulkExposureDecrease,
        handleBulkExposureIncrease,
        handleBulkExposureIncreaseMax,
        handleBulkContrastDecreaseMax,
        handleBulkContrastDecrease,
        handleBulkContrastIncrease,
        handleBulkContrastIncreaseMax,
        handleBulkHighlightsDecreaseMax,
        handleBulkHighlightsDecrease,
        handleBulkHighlightsIncrease,
        handleBulkHighlightsIncreaseMax,
        handleBulkShadowsDecreaseMax,
        handleBulkShadowsDecrease,
        handleBulkShadowsIncrease,
        handleBulkShadowsIncreaseMax,
        handleBulkWhitesDecreaseMax,
        handleBulkWhitesDecrease,
        handleBulkWhitesIncrease,
        handleBulkWhitesIncreaseMax,
        handleBulkBlacksDecreaseMax,
        handleBulkBlacksDecrease,
        handleBulkBlacksIncrease,
        handleBulkBlacksIncreaseMax,
        // Adjustment Details
        handleBulkClarityDecreaseMax,
        handleBulkClarityDecrease,
        handleBulkClarityIncrease,
        handleBulkClarityIncreaseMax,
        handleBulkSharpnessDecreaseMax,
        handleBulkSharpnessDecrease,
        handleBulkSharpnessIncrease,
        handleBulkSharpnessIncreaseMax,
    };
}