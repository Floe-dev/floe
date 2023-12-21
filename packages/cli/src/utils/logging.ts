const chalkImport = import("chalk").then((m) => m.default);

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is the type returned by Axios
export async function logAxiosError(error: any) {
  const chalk = await chalkImport;

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(
      chalk.red(`${error.response.status}: ${error.response.data.message}`)
    );
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser
    // and an instance of http.ClientRequest in node.js
    console.log("Request error: ", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("An error occurred: ", error.message);
  }
}
