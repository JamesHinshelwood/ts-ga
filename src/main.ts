import * as core from '@actions/core'
import * as github from '@actions/github'
import {wait} from './wait'
import * as fs from 'fs'
import { promisify } from 'util';

async function run(): Promise<void> {
  try {
    const token = core.getInput("token");
    const octokit = github.getOctokit(token);

    const files = await fs.promises.readdir("ppc/user-service/src/main/resources/db/migration");
    
    files.forEach(file => {
      core.debug(`File found: ${file}`);
    });

    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
