export class EmojiSetting {
    private ignoredFileTypes:       Set<string> = new Set();
    private ignoredDocumentPaths:   Set<string> = new Set();

    /**
     * Starts ignoring
     * @param fileType 
     * @returns 
     */
    public ignoreNewFileType(fileType: string) : Set<string> {
        return this.ignoredFileTypes.add(fileType);
    }

    /**
     * Starts ignoring file on specified path
     * @param documentPath 
     * @returns 
     */
    public ignoreNewDocument(documentPath: string) : Set<string> {
        return this.ignoredDocumentPaths.add(documentPath);
    }

    /**
     * Stops ignoring specific file types
     * @param fileType (.txt | .css )
     * @returns 
     */
    public stopIgnoringFileType(fileType: string) : Set<string> {
        this.ignoredFileTypes.delete(fileType);
        return this.ignoredFileTypes;
    }

    /**
     * Stops ignoring document
     * @param documentPath 
     * @returns 
     */
    public stopIgnoringDocument(documentPath: string) : Set<string> {
        this.ignoredDocumentPaths.delete(documentPath);
        return this.ignoredDocumentPaths;
    }
}