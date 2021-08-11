import * as core from '@actions/core'
//import * as github from '@actions/github'
import {wait} from './wait'
import * as fs from 'fs'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    core.debug(`Token: ${token}`)
    //const octokit = github.getOctokit(token)

    const files = await fs.promises.readdir('test/migration')

    const re = /V([1-9][0-9]*)__[a-zA-Z_]+.sql/;
    const versions = files.map(file => file.match(re)![1]);
    if (versions.length != (new Set(versions)).size) {
      core.setFailed(`Duplicate migration versions detected`);
      return;
    }

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
