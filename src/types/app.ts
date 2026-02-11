export interface AppThemeConfig {
    fontFamily?: {
        primary?: string;
        secondary?: string;
    };
    fontSize?: number;
}

export interface AppConfig {
    id: string;
    name: string;
    description?: string;
    hostPrefix?: string;
    pathPrefix?: string;
    theme?: AppThemeConfig;
    /**
     * Function to load the main App component
     */
    loadApp: () => Promise<any>;
    /**
     * Function to load the language resources
     */
    loadLang: () => Promise<any>;
}

export type AppRegistry = AppConfig[];
