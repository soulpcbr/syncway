@echo off
setlocal
SET PATH=%~dp0
set "SELF=%~dp0%uninstall.bat"
set "CURRENT_DIR=%cd%"
SET SERVICE_EXE=%"%\syncway-1.0.0.exe%"%
SET SERVICENAME=%"%Syncway%"%

:install
ECHO Stopping service "%SERVICENAME%"
cd "%PATH%"
nssm stop %SERVICENAME%
cd "%CURRENT_DIR%"
GOTO end
:fail
echo FAILURE -- Could not stop service "%SERVICENAME%"
:end
ECHO DONE!!!
Pause
