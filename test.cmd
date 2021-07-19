@echo off
if "%~1" == "" (
	for %%a in (test\*.sb3) do (
		unzip -o "%%~fa" project.json || goto :stop
		node SAE-.js
	)
) else (
	if exist "%~f1" (
		unzip -o "%~f1" project.json || goto :stop
	) else if exist "test\%~1.sb3" (
		unzip -o "test\%~1.sb3" project.json || goto :stop
	) else if exist "test\%~1" (
		unzip -o "test\%~1" project.json || goto :stop
	) else (
		echo 找不到 "%~1" 或者 "test\%~1.sb3" 或者 "test\%~1"。
		goto :stop
	)
	node SAE-.js
)
:stop
pause
