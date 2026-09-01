module.exports = function (config) {
    config.set({
        basePath: "",
        frameworks: ["jasmine"],
        plugins: [
            require("karma-jasmine"),
            require("karma-chrome-launcher"),
            require("karma-jasmine-html-reporter"),
            require("karma-coverage")
        ],
        client: {
            clearContext: false
        },
        coverageReporter: {
            dir: require("path").join(__dirname, "coverage/my-app"),
            reporters: [
                { type: "html" },
                { type: "lcovonly" },
                { type: "text-summary" }
            ],
            fixWebpackSourcePaths: true
        },
        reporters: ["progress", "kjhtml"],
        customLaunchers: {
            ChromeHeadlessCI: {
                base: "ChromeHeadless",
                flags: [
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    "--no-sandbox"
                ]
            }
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ["ChromeHeadlessCI"],
        singleRun: true,
        restartOnFileChange: false
    });
};
