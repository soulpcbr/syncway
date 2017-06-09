@echo off
setlocal
set "SELF=%~dp0%install.bat"
set "CURRENT_DIR=%cd%"
SET PATH=%~dp0
SET SERVICE_EXE=%"%\syncway.exe%"%
SET SERVICENAME=%"%Syncway%"%

:install
ECHO Installing service "%SERVICENAME%"
cd "%PATH%"
nssm install %SERVICENAME% %PATH%%SERVICE_EXE%
nssm set %SERVICENAME% AppEnvironmentExtra SECRET_TOKEN=syncthewayitgone
cd "%CURRENT_DIR%"
GOTO end
:fail
echo FAILURE -- Could  install service "%SERVICENAME%"
:end
ECHO DONE!!!
Pause
