'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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

const initialAdjustments: AdjustmentState = {
    tempScore: 0,
    tintScore: 0,
    exposureScore: 0,
    highlightsScore: 0,
    shadowsScore: 0,
    whitesScore: 0,
    blacksScore: 0,
    saturationScore: 0,
    contrastScore: 0,
    clarityScore: 0,
    sharpnessScore: 0,
};


const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export function useHonchoEditor() {
    const editorRef = useRef<HonchoEditor | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [editorStatus, setEditorStatus] = useState("Initializing...");
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const [adjustments, setAdjustments] = useState<AdjustmentState>(initialAdjustments);

    const [history, setHistory] = useState<AdjustmentState[]>([initialAdjustments]);
    const [historyIndex, setHistoryIndex] = useState(0);

    function applyAdjustmentState(state: AdjustmentState) {
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
    }

    // Adjustment State
    // already 100
    const [tempScore, setTempScore] = useState(0);
    const [tintScore, setTintScore] = useState(0);
    // increment 0.01 min: -3, max: 3 // fixed got normal 5
    const [exposureScore, setExposureScore] = useState(0);
    // increment 0.01 min: -1, max: 1 // fixed got normal 100
    const [highlightsScore, setHighlightsScore] = useState(0);
    const [shadowsScore, setShadowsScore] = useState(0);
    const [whitesScore, setWhitesScore] = useState(0);
    const [blacksScore, setBlacksScore] = useState(0);
    const [saturationScore, setSaturationScore] = useState(0);
    const [contrastScore, setContrastScore] = useState(0);
    const [clarityScore, setClarityScore] = useState(0);
    const [sharpnessScore, setSharpnessScore] = useState(0);

    const setAdjustment = useCallback(<K extends keyof AdjustmentState>(key: K, value: AdjustmentState[K]) => {
      setAdjustments(prev => ({ ...prev, [key]: value }));
    }, []);

    // Bulk Editor score detail
    const adjustClarity = useCallback((uiAmount: number) => {
      setAdjustment('clarityScore', clamp((adjustments.clarityScore * 100 + uiAmount) / 100));
    }, [adjustments.clarityScore, setAdjustment]);

    const adjustSharpness = useCallback((uiAmount: number) => {
      setAdjustment('sharpnessScore', clamp((adjustments.sharpnessScore * 100 + uiAmount) / 100));
    }, [adjustments.sharpnessScore, setAdjustment]);


    // Logic for WASM Module script load

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
        if (editorRef.current && canvasRef.current && editorRef.current.getInitialized()) {
        editorRef.current.processImage();
        editorRef.current.renderToCanvas(canvasRef.current);
        }
    }, []);

    const loadImage = useCallback(async (file: File) => {
        if (!editorRef.current) {
        console.error("loadImage called but editorRef is not set.");
        setEditorStatus("Editor not ready. WASM module may have failed to load.");
        return;
        }
        setEditorStatus("Loading image...");
        try {
        await editorRef.current.loadImageFromFile(file);
        setIsImageLoaded(true); // This will trigger the useEffect below
        } catch (e) {
        console.error("Error loading image into WASM module:", e);
        setEditorStatus("Error: Could not load the image file.");
        setIsImageLoaded(false);
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
        loadImage(file);
        }
    };

    const handleRevert = useCallback(() => {
        if (!editorRef.current) return;
        editorRef.current.resetAdjustments();
        setTempScore(0);
        setTintScore(0);
        setExposureScore(0);
        setHighlightsScore(0);
        setShadowsScore(0);
        setWhitesScore(0);
        setBlacksScore(0);
        setSaturationScore(0);
        setContrastScore(0);
        setClarityScore(0);
        setSharpnessScore(0);
    }, []);

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            applyAdjustmentState(history[prevIndex]);
            setHistoryIndex(prevIndex);
        }
    }, [history, historyIndex]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            applyAdjustmentState(history[nextIndex]);
            setHistoryIndex(nextIndex);
        }
    }, [history, historyIndex]);

    useEffect(() => {
        if (isImageLoaded && editorRef.current && canvasRef.current) {
        const { width, height } = editorRef.current.getImageSize();
        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;
        updateCanvas(); // Now it's safe to draw.
        setEditorStatus("Image loaded successfully!");
        }
    }, [isImageLoaded, updateCanvas]);

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

        const newState: AdjustmentState = {
            tempScore,
            tintScore,
            exposureScore,
            highlightsScore,
            shadowsScore,
            whitesScore,
            blacksScore,
            saturationScore,
            contrastScore,
            clarityScore,
            sharpnessScore,
        };

        // If the new state is the same as the current history index, do nothing
        if (JSON.stringify(history[historyIndex]) === JSON.stringify(newState)) return;

        // If we are not at the end of the history, discard redo states
        const newHistory = history.slice(0, historyIndex + 1);

        setHistory([...newHistory, newState]);
        setHistoryIndex(newHistory.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        tempScore, tintScore, exposureScore, highlightsScore, shadowsScore,
        whitesScore, blacksScore, saturationScore, contrastScore, clarityScore, sharpnessScore,
        isImageLoaded
    ]);

    return {
        // Refs
        canvasRef,
        fileInputRef,
        // Status
        editorStatus,
        isEditorReady,
        isImageLoaded,
        // Functions
        handleScriptReady,
        handleFileChange,
        handleRevert,
        handleUndo,
        handleRedo,
        // Adjustment Functions
        adjustClarity,
        adjustSharpness,
        // Adjustment State & Setters
        tempScore, setTempScore,
        tintScore, setTintScore,
        exposureScore, setExposureScore,
        highlightsScore, setHighlightsScore,
        shadowsScore, setShadowsScore,
        whitesScore, setWhitesScore,
        blacksScore, setBlacksScore,
        saturationScore, setSaturationScore,
        contrastScore, setContrastScore,
        clarityScore, setClarityScore,
        sharpnessScore, setSharpnessScore,
    };
}