export interface ApiResponse {
    status: number
    data: {}
}

export interface DocumentStats {
    documentURI: string
    averageScore: number,
    numberofScores: number
}

export interface StatHolder {
    highQualityDocuments: DocumentStats[];
    lowQualityDocuments: DocumentStats[];
}

export interface GetMarkersResponse {
    content:        string,
    documentUri:    string,
    repository:     string,
    line:           number,
    isDeleted:      boolean,
    isResolved:     boolean,
    isSupressed:    boolean
    scores:         ScoresResponse[]
}

export interface ScoresResponse {
    frequency: number,
    value: number,
}