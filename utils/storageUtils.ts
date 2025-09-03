import AsyncStorage from '@react-native-async-storage/async-storage';

const getItemFromStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    }
  } catch (error) {
    return null
  }
}

const setItemToStorage = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (error) {
    return null
  }
}

const removeItemFromStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    return null
  }
}

export { getItemFromStorage, removeItemFromStorage, setItemToStorage };
