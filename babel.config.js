module.exports = {
    presets: [
        ["next/babel"]
    ],
    plugins: [
        [
            "module-resolver",
            {
                root: ["$PWD"],
                extensions: [
                    ".ts",
                    ".tsx",
                    ".jsx",
                    ".js",
                    ".json",
                    ".md",
                ],
                alias: {
                    "@components": "./components",
                    "@data": "./data",
                    "@lib": "./lib",
                    "@pages": "./pages",
                    "constants": "./constants",
                    "@public": "./public",
                    "@styles": "./styles",
                    "@typings": "./typings",
                    "@env": "./env.d.ts",
                },
            },
        ],
    ]
}