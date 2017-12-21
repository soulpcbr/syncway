@echo off
setlocal
set "SELF=%~dp0%install.bat"
set "CURRENT_DIR=%cd%"
SET PATH=%~dp0
SET SERVICE_EXE=%"%\node.exe server\app.js%"%
SET SERVICENAME=%"%Syncway%"%
SET FFMPEG_PATH="C:\work\Syncway\ffmpeg\bin\ffmpeg.exe"
SET FFPROBE_PATH=C:\work\Syncway\ffmpeg\bin\ffprobe.exe"

:install
ECHO Installing service "%SERVICENAME%"
cd "%PATH%"
nssm install %SERVICENAME% %PATH%%SERVICE_EXE%
nssm set %SERVICENAME% AppEnvironmentExtra SECRET_TOKEN=syncthewayitgone FFMPEG_PATH="%CURRENT_DIR%\ffmpeg\bin\ffmpeg.exe" FFPROBE_PATH="%CURRENT_DIR%\ffmpeg\bin\ffprobe.exe"
cd "%CURRENT_DIR%"
GOTO end
:fail
echo FAILURE -- Could  install service "%SERVICENAME%"
:end
ECHO DONE!!!
Pause
