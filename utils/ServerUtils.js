const { exec } = require("child_process");

const killProcessOnPort = (port) => {
  const command =
    process.platform === "win32"
      ? `netstat -ano | findstr :${port}`
      : `lsof -i :${port}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }

    const pid =
      process.platform === "win32"
        ? stdout.split(/\s+/).pop()
        : stdout.split("\n")[1]?.split(/\s+/)[1];

    if (pid) {
      console.log(`Process using port ${port}: PID ${pid}`);
      const killCommand =
        process.platform === "win32"
          ? `taskkill /PID ${pid} /F`
          : `kill -9 ${pid}`;

      exec(killCommand, (killError, killStdout, killStderr) => {
        if (killError) {
          console.error(`Error killing process: ${killError.message}`);
          return;
        }

        if (killStderr) {
          console.error(`Stderr: ${killStderr}`);
          return;
        }

        console.log(`Process ${pid} using port ${port} has been killed.`);
      });
    } else {
      console.log(`No process is using port ${port}`);
    }
  });
};

module.exports = { killProcessOnPort };
