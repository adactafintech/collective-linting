import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git';

export class GitService {
    git: SimpleGit;

    /**
     * 
     * @param filePath 
     */
    constructor(filePath: string) {
        const options: Partial<SimpleGitOptions> = {
            baseDir: filePath,
            binary: 'git',
            maxConcurrentProcesses: 6,
         };

        this.git = simpleGit(options);
    }

    /**
     * 
     * @returns string
     */
    public getBaseDir() :  string {
        return process.cwd();
    }

    public getRepository() {
        return this.git.raw(['ls-remote', '--get-url']);
    }

    /**
     * 
     * @param filePath 
     * @returns 
     */
    public getFileName(filePath: string) {
       return this.git.raw(['ls-files', '--full-name', filePath]);
    }

    public getUserName() {
        return this.git.raw(["config", "user.email"]);
    }
}