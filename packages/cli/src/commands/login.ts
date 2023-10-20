import chalk from "chalk";
import { Command } from "commander";
import { readFileSync } from "fs";
import { glob } from "glob";
import { createSpinner } from "nanospinner";
import { validate as validateMarkdoc } from "@floe/markdoc";
import { validate as validateSchema } from "@floe/config";
import fs from "fs";
import axios from "axios";
import { api } from "@floe/trpc/client";
import { sleep } from "../utils/sleep.js";

const CLIENT_ID = "Iv1.ee3594a4d2ac274a";

function requestDeviceCode() {
  return axios.post(
    `https://github.com/login/device/code`,
    {
      client_id: CLIENT_ID,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
}

function requestToken(deviceCode: string) {
  return axios.post(
    `https://github.com/login/oauth/access_token`,
    {
      client_id: CLIENT_ID,
      device_code: deviceCode,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
}

function pollForToken(deviceCode: string) {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const response = await requestToken(deviceCode);
        const { error, interval: i } = response.data;
        const interval = i * 1000;

        if (error) {
          switch (error) {
            case "authorization_pending":
              setTimeout(poll, interval);
              break;
            case "slow_down":
              setTimeout(poll, interval);
              break;
            case "expired_token":
              reject(error);
              break;
            case "incorrect_client_credentials":
              reject(error);
              break;
            case "access_denied":
              reject(error);
              break;
            default:
              reject(error);
              break;
          }
          return;
        }

        resolve(response.data);
      } catch (error: any) {
        reject(error);
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
      // const deviceCode = await requestDeviceCode();

      // console.log("Please visit: ", deviceCode.data.verification_uri);
      // console.log("And enter: ", deviceCode.data.user_code);

      // const token = await pollForToken(deviceCode.data.device_code);
      // console.log("TOKEN: ", token);

      const res = await api.user.test.query();
      console.log("RES: ", res);
    });
}
