@echo off
setlocal
SET PATH=%~dp0
set "SELF=%~dp0%uninstall.bat"
set "CURRENT_DIR=%cd%"
SET SERVICE_EXE=%"%\syncway.exe%"%
SET SERVICENAME=%"%Syncway%"%

:install
ECHO Starting service "%SERVICENAME%"
cd "%PATH%"
nssm start %SERVICENAME%
cd "%CURRENT_DIR%"
GOTO end
:fail
echo FAILURE -- Could not start service "%SERVICENAME%"
:end
ECHO DONE!!!
Pause
