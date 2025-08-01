import { type Controller, type Preset, type AdjustmentState, type ImageItem } from "@/hooks/editor/useHonchoEditor";

const MOCK_IMAGES: ImageItem[] = Array.from({ length: 20 }, (_, i) => ({
    id: `img_${i + 1}`,
    name: `Image ${i + 1}.jpg`,
    url: `https://picsum.photos/id/${i + 10}/200/200`,
    file: new File([], `Image ${i + 1}.jpg`),
}));

export const apiController: Controller = {
  /**
   * Fetches an image from your backend API.
   * @param imageID The ID of the image to fetch.
   * @returns A Promise that resolves to a File object, or null if it fails.
   */
  onGetImage: async (imageID: string): Promise<string | null> => {
    console.log(`[API Controller] Getting URL for image ID: ${imageID}`);
    // In a real app, this would query your backend for the image's public URL.
    // For this demo, we'll find it in our mock list.
    const image = MOCK_IMAGES.find(img => img.id === imageID);
    if (image) {
        return Promise.resolve(image.url);
    }
    console.error(`Image with ID ${imageID} not found in mock list.`);
    return Promise.resolve(null);
  },

  getImageList: async (): Promise<ImageItem[]> => {
    console.log("[API Controller] Getting image list for bulk editor...");
    // In a real app, you would fetch from your API:
    // const response = await fetch('/api/images');
    // return await response.json();
    
    return Promise.resolve(MOCK_IMAGES);
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
};