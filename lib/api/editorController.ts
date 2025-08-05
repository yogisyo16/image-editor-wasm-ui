import { type Controller, type Preset, type AdjustmentState, type ImageItem } from "@/hooks/editor/useHonchoEditor";

let idToken: string | null = null;

const nativeCallbacks = new Map<string, { resolve: (value: string) => void; reject: (reason?: any) => void }>();

// const MOCK_IMAGES: ImageItem[] = Array.from({ length: 20 }, (_, i) => ({
//     id: `img_${i + 1}`,
//     name: `Image ${i + 1}.jpg`,
//     url: `https://picsum.photos/id/${i + 10}/200/200`,
//     file: new File([], `Image ${i + 1}.jpg`),
// }));

function handleNativeImageResponse(callbackId: string, base64Data: string | null, error: string | null) {
    if (nativeCallbacks.has(callbackId)) {
        const { resolve, reject } = nativeCallbacks.get(callbackId)!;
        if (error) {
            console.error(`Native Error for ${callbackId}:`, error);
            reject(new Error(error));
        } else if (base64Data) {
            // Prepend the data URL scheme for direct use in an <img> src
            const dataUrl = `data:image/jpeg;base64,${base64Data}`;
            resolve(dataUrl);
        } else {
            reject(new Error('Native side returned no data and no error.'));
        }
        // Clean up the callback
        nativeCallbacks.delete(callbackId);
    }
}

// Expose the handler function globally so native code can see it
if (typeof window !== 'undefined') {
    (window as any).handleNativeImageResponse = handleNativeImageResponse;
}

interface NativeController extends Controller {
    setToken: (token: string) => void;
}

// --- END: NATIVE COMMUNICATION BRIDGE ---

// const baseUrl = 'https://dev.portal.ubersnap.com/gallery/67ee6b55b8e4273707f68978';
// const finalUrl = `${baseUrl}?preview=${imageID}`;

export const apiController: Controller = {
    /**
     * A new function to allow the native app to set the authentication token.
     */
    onGetImage: async (imageID: string): Promise<string | null> => {
        console.log(`[JS Bridge] Requesting image with ID: ${imageID}`);

        const iOSBridge = (window as any).webkit?.messageHandlers?.nativeHandler;
        const androidBridge = (window as any).Android;

        // This block is now updated for a real web API call
        if (!iOSBridge && !androidBridge) {
            console.warn("[JS Bridge] Native bridge not found. Using Web API call.");

            // The issue is that you were fetching the gallery page URL.
            // For the web version, you must return the DIRECT URL to the IMAGE FILE.
            // By inspecting your gallery page, the actual image URL has this structure.
            // We can construct it directly.
            const imageUrl = `https://d2cxumz3vt1s04.cloudfront.net/staging/gallery-photo/67ee6b55b8e4273707f68978/preview/${imageID}.jpeg`;

            console.log(`[Web Fallback] Constructed direct image URL: ${imageUrl}`);

            // Simply return this URL. The loadImageFromUrl function will then fetch it correctly.
            return Promise.resolve(imageUrl);
        }

        // The native promise-based communication remains the same
        return new Promise((resolve, reject) => {
            const callbackId = `cb_${Date.now()}_${Math.random()}`;
            nativeCallbacks.set(callbackId, { resolve, reject });

            try {
                if (iOSBridge) {
                    const message = {
                        action: 'getImage',
                        imageId: imageID,
                        callbackId: callbackId,
                        token: idToken
                    };
                    iOSBridge.postMessage(message);
                } else if (androidBridge) {
                    androidBridge.getImageForEditing(imageID, callbackId, idToken);
                }
            } catch (err) {
                console.error("[JS Bridge] Error calling native function:", err);
                nativeCallbacks.delete(callbackId);
                reject(err);
            }
        });
    },

    getImageList: async (): Promise<ImageItem[]> => {
        console.log("[API Controller] Getting image list for bulk editor...");
        // In a real app, you would fetch from your API:
        // const response = await fetch('/api/images');
        // return await response.json();
        const response = await fetch('/api/images');
        return await response.json();
    },

    syncConfig: async (): Promise<void> => {
        console.log("[API Controller] Syncing configuration...");
        // You could fetch user-specific settings or initial data here.
    },

    getPresets: async (): Promise<Preset[]> => {
        console.log("[API Controller] Getting presets...");
        // const response = await fetch('/api/presets');
        // return await response.json();
        // For now, return a mock promise
        return Promise.resolve([
            { id: 'server-preset-1', name: 'My Preset 1' },
            { id: 'server-preset-2', name: 'My Preset 2' },
            { id: 'server-preset-3', name: 'My Preset 3' },
        ]);
    },

    createPreset: async (name: string, settings: AdjustmentState): Promise<Preset | null> => {
        console.log("[API Controller] Creating preset:", { name, settings });
        // const response = await fetch('/api/presets', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ name, settings })
        // });
        // return await response.json();
        // For now, return a mock new preset
        const newPreset = { id: `new-${Date.now()}`, name };
        return Promise.resolve(newPreset);
    },

    deletePreset: async (presetId: string): Promise<void> => {
        console.log(`[API Controller] Deleting preset: ${presetId}`);
        // await fetch(`/api/presets/${presetId}`, { method: 'DELETE' });
        return Promise.resolve();
    },

    renamePreset: async (presetId: string, newName: string): Promise<void> => {
        console.log(`[API Controller] Renaming preset ${presetId} to ${newName}`);
        // await fetch(`/api/presets/${presetId}`, { 
        //   method: 'PATCH',
        //   body: JSON.stringify({ name: newName }) 
        // });
        return Promise.resolve();
    },
    onBack: function (): void {
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
    }
};