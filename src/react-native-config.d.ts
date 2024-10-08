declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL: string;
    GOOGLE_MAPS_API_KEY?: string;
    FIREBASE_API_KEY?: string;
    FIREBASE_AUTH_DOMAIN?: string;
    FIREBASE_DATABASE_URL?: string;
    FIREBASE_PROJECT_ID?: string;
    FIREBASE_STORAGE_BUCKET?: string;
    FIREBASE_MESSAGING_SENDER_ID?: string;
    FIREBASE_APP_ID?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
