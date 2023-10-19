import chalk from "chalk";
import { Command } from "commander";
import { readFileSync } from "fs";
import { glob } from "glob";
import { createSpinner } from "nanospinner";
import { validate as validateMarkdoc } from "@floe/markdoc";
import { validate as validateSchema } from "@floe/config";
import fs from "fs";
import axios from "axios";
import { sleep } from "../utils/sleep.js";

const CLIENT_ID = "Iv1.ee3594a4d2ac274a";

function requestDeviceCode() {
  return axios.post(`https://github.com/login/device/code`, {
    client_id: CLIENT_ID,
  });
}

function requestToken(deviceCode: string) {
  return axios.post(`https://github.com/login/oauth/access_token`, {
    client_id: CLIENT_ID,
    device_code: deviceCode,
    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
  });
}

function pollForToken(deviceCode: string, interval: number) {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const response = await requestToken(deviceCode);
        resolve(response.data);
      } catch (error: any) {
        if (error.response.data.error === "authorization_pending") {
          setTimeout(poll, interval);
        } else {
          reject(error);
        }
      }
    };

    poll();
  });
}

export function login(program: Command) {
  program
    .command("login")
    .description("Autneticate with Floe")
    .action(async () => {
      const deviceCode = await requestDeviceCode();
      console.log("DEVICECODE: ", deviceCode.data);

      const token = await pollForToken(deviceCode.data.device_code, 5000);
      console.log("TOKEN: ", token);
    });
}
