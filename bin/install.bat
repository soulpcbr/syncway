@echo off
setlocal
set "SELF=%~dp0%install.bat"
set "CURRENT_DIR=%cd%"
SET PATH=%~dp0
SET SERVICE_EXE=%"%\node.exe server\app.js%"%
SET SERVICENAME=%"%Syncway%"%


:install
ECHO Installing service "%SERVICENAME%" PATH "%PATH%"
cd "%PATH%"
start node_modules\@ffmpeg-installer\win32-x64\ffmpeg -i "rtsp://184.72.239.149/vod/mp4:BigBuckBunny_175k.mov" -vf fps=1 -t 1 test.png
nssm install %SERVICENAME% %PATH%%SERVICE_EXE%
nssm set %SERVICENAME% AppEnvironmentExtra SECRET_TOKEN=syncthewayitgone
cd "%CURRENT_DIR%"
GOTO end
:fail
echo FAILURE -- Could  install service "%SERVICENAME%"
:end
ECHO DONE!!!
Pause
