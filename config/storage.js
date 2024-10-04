import * as Storage from 'expo-secure-store'

export const isStorageAvailable = async() => {
    const available = await Storage.isAvailableAsync();
    if (!available) {
        throw new Error('Secure Store is not available');
    }
}

export async function removeKey(key){
    await isStorageAvailable();
    try {
        await Storage.deleteItemAsync(key);
    } catch (error) {
        throw error;
    }
}

export async function getKey(key){
    await isStorageAvailable();
    try {
        await Storage.getItemAsync(key);
    } catch (error) {
        throw error;
    }
}

export async function setKey(key){
    await isStorageAvailable();
    try {
        await Storage.setItemAsync(key)
    } catch (error) {
        throw error;
    }
}