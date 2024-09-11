@echo off
setlocal

:: Concatenate commands using && to ensure they run sequentially
echo Building the project...
yarn install && yarn build && echo yarn build completed with errorlevel %errorlevel% && (
    if %errorlevel% neq 0 (
        echo Error occurred during yarn build. Exiting...
        pause
        exit /b %errorlevel%
    )
) && echo Deploying to GitHub Pages... && yarn run deploy && echo yarn run deploy completed with errorlevel %errorlevel% && (
    if %errorlevel% neq 0 (
        echo Error occurred during yarn run deploy. Exiting...
        pause
        exit /b %errorlevel%
    )
)

:: Keep the command line window open
echo Deployment completed successfully.
pause

endlocal