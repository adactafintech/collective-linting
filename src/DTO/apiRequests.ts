export interface CreateOrUpdateRequest {
    score: number,
    user: string,
    documentUri: string,
    repository: string,
    line: number,
    content: string
}

export interface RemoveScoreRequest {
    documentUri: string,
    repository: string,
    line: number,
    user: string
}

export interface FindMarkerRequest {
    document: string,
    remote: string
}