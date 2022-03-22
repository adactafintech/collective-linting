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
    };

    public getBaseDir() :  string {
        return process.cwd();
    }

    public getRepository() {
        return this.git.raw(['ls-remote', '--get-url']);
    }

    public getFileName(filePath: string) {
       return this.git.raw(['ls-files', '--full-name', filePath]);
    }
}