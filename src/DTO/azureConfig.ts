export interface AzureClientCredentialRequest {
    authority: string,
    scopes: []
}

export interface AzurePortalConfig {
    auth: {
        clientId:       string,
        authority:      string,
        clientSecret:   string,
        redirectUri:    string,
    }
}