import * as Storage from 'expo-secure-store'

export const isStorageAvailable = async() => {
    const available = await Storage.isAvailableAsync();
    if (!available) {
        throw new Error('Secure Store is not available');
    }
}

export async function removeStorageKey(key){
    await isStorageAvailable();
    try {
        await Storage.deleteItemAsync(key);
    } catch (error) {
        throw error;
    }
}

export async function getStorageKey(key){
    await isStorageAvailable();
    try {
        return await Storage.getItemAsync(key);
    } catch (error) {
        throw error;
    }
}

export async function setStorageKey(key){
    await isStorageAvailable();
    try {
        await Storage.setItemAsync(key)
    } catch (error) {
        throw error;
    }
}