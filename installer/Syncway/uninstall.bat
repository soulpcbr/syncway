@echo off
setlocal
SET PATH=%~dp0
set "SELF=%~dp0%uninstall.bat"
set "CURRENT_DIR=%cd%"
SET SERVICE_EXE=%"%\syncway-1.0.1.exe%"%
SET SERVICENAME=%"%Syncway%"%

:install
ECHO Uninstalling service "%SERVICENAME%"
cd "%PATH%"
nssm remove %SERVICENAME% confirm
cd "%CURRENT_DIR%"
GOTO end
:fail
echo FAILURE -- Could not uninstall service "%SERVICENAME%"
:end
ECHO DONE!!!
Pause
