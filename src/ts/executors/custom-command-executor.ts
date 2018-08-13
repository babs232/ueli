import { CommandLineExecutor } from "./command-line-executor";
import { Executor } from "./executor";
import { CommandLineExecutionArgumentValidator } from "../execution-argument-validators/command-line-execution-argument-validator";
import { UeliHelpers } from "../helpers/ueli-helpers";
import { exec } from "child_process";

export class CustomCommandExecutor implements Executor {
    public hideAfterExecution = true;
    public readonly resetUserInputAfterExecution = true;
    public readonly logExecution = false;
    private commandLineExecutor: CommandLineExecutor;

    constructor(commandLineExecutor: CommandLineExecutor) {
        this.commandLineExecutor = commandLineExecutor;
    }

    public execute(executionArgument: string): void {
        executionArgument = executionArgument.replace(UeliHelpers.customCommandPrefix, "");
        if (new CommandLineExecutionArgumentValidator().isValidForExecution(executionArgument)) {
            this.hideAfterExecution = false;
            this.commandLineExecutor.execute(executionArgument);
            return;
        }

        this.hideAfterExecution = true;
        exec(executionArgument, (err: Error): void => {
            if (err) {
                throw err;
            }
        });
    }
}
