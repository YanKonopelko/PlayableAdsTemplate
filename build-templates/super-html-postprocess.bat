@echo off
setlocal enabledelayedexpansion
REM Super-HTML build postprocessor (Windows Batch)
REM 
REM Actions:
REM 1) For all .html files in build/super-html/unity/ inject the volumeChange script
REM    before </body> (or append if </body> is missing). Skips if already present.
REM 2) For all .html files in build/super-html/ironsource/ replace
REM    window.super_html_channel = "ironsource" with "unity".
REM
REM Usage:
REM   Double-click this .bat file or run from command line

REM Get the directory where this bat file is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

set "UNITY_DIR=%SCRIPT_DIR%super-html\unity"
set "IRONSOURCE_DIR=%SCRIPT_DIR%super-html\ironsource"

echo [super-html-postprocess] Starting...
echo.

REM Counters
set /a UNITY_TOTAL=0
set /a UNITY_CHANGED=0
set /a UNITY_SKIPPED=0
set /a UNITY_ERRORS=0
set /a IRONSOURCE_TOTAL=0
set /a IRONSOURCE_CHANGED=0
set /a IRONSOURCE_SKIPPED=0
set /a IRONSOURCE_ERRORS=0

REM Process Unity files
if exist "%UNITY_DIR%" (
    echo Processing Unity files...
    for %%f in ("%UNITY_DIR%\*.html") do (
        set /a UNITY_TOTAL+=1
        call :process_unity_file "%%f"
        set RESULT=!errorlevel!
        if !RESULT! equ 3 (
            set /a UNITY_ERRORS+=1
        ) else if !RESULT! equ 2 (
            set /a UNITY_SKIPPED+=1
        ) else if !RESULT! equ 1 (
            set /a UNITY_CHANGED+=1
        )
    )
) else (
    echo [WARNING] Unity directory not found: %UNITY_DIR%
)

echo.

REM Process Ironsource files
if exist "%IRONSOURCE_DIR%" (
    echo Processing Ironsource files...
    for %%f in ("%IRONSOURCE_DIR%\*.html") do (
        set /a IRONSOURCE_TOTAL+=1
        call :process_ironsource_file "%%f"
        set RESULT=!errorlevel!
        if !RESULT! equ 3 (
            set /a IRONSOURCE_ERRORS+=1
        ) else if !RESULT! equ 2 (
            set /a IRONSOURCE_SKIPPED+=1
        ) else if !RESULT! equ 1 (
            set /a IRONSOURCE_CHANGED+=1
        )
    )
) else (
    echo [WARNING] Ironsource directory not found: %IRONSOURCE_DIR%
)

echo.
echo [super-html-postprocess] Completed
echo.
echo Summary:
echo   Unity: Total=!UNITY_TOTAL! Changed=!UNITY_CHANGED! Skipped=!UNITY_SKIPPED! Errors=!UNITY_ERRORS!
echo   Ironsource: Total=!IRONSOURCE_TOTAL! Changed=!IRONSOURCE_CHANGED! Skipped=!IRONSOURCE_SKIPPED! Errors=!IRONSOURCE_ERRORS!
echo.

set EXIT_CODE=0
if !UNITY_ERRORS! GTR 0 set EXIT_CODE=1
if !IRONSOURCE_ERRORS! GTR 0 set EXIT_CODE=1

if !EXIT_CODE! equ 0 (
    echo [SUCCESS] All files processed successfully!
) else (
    echo [WARNING] Some errors occurred during processing!
)

echo.
pause
exit /b !EXIT_CODE!

REM Function to process Unity HTML file
REM Returns: 1=changed, 2=skipped, 3=error
:process_unity_file
set "FILE_PATH=%~1"
set "TEMP_PS=%TEMP%\postprocess_unity_%RANDOM%.ps1"
(
echo $ErrorActionPreference='Stop'
echo try ^{
echo     $filePath = "%FILE_PATH%"
echo     $exclam = [char]33
echo     $neq = [char]33 + [char]61
echo     $marker = "function volumeChange(e){window.mute=" + $exclam + $exclam + "e}"
echo     $scriptLine1 = "<script type=""text/javascript"">"
echo     $func1 = "function volumeChange(e){window.mute=" + $exclam + $exclam + "e}"
echo     $func2 = [char]34 + "undefined" + [char]34 + $neq + "typeof dapi"
echo     $func3 = "dapi.addEventListener(" + [char]34 + "audioVolumeChange" + [char]34 + ",volumeChange),"
echo     $func4 = [char]34 + "undefined" + [char]34 + $neq + "typeof mraid"
echo     $func5 = "mraid.addEventListener(" + [char]34 + "audioVolumeChange" + [char]34 + ",volumeChange);"
echo     $amp = "&&"
echo     $scriptLine2 = $func1 + $func2 + $amp + $func3 + $func4 + $amp + $func5
echo     $scriptLine3 = "</script>"
echo     $script = $scriptLine1 + [char]13 + [char]10 + $scriptLine2 + [char]13 + [char]10 + $scriptLine3
echo     $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8^)
echo     if ($content -match [regex]::Escape($marker^)^) ^{
echo         Write-Host ('  SKIP: Already contains volume script: ' + (Split-Path $filePath -Leaf^)^)
echo         exit 2
echo     ^}
echo     $lowerContent = $content.ToLower^(^)
echo     $bodyTag = [char]60 + '/body' + [char]62
echo     $bodyIndex = $lowerContent.LastIndexOf($bodyTag^)
echo     if ($bodyIndex -ge 0^) ^{
echo         $newContent = $content.Substring(0, $bodyIndex^) + [char]13 + [char]10 + $script + [char]13 + [char]10 + $content.Substring($bodyIndex^)
echo     ^} else ^{
echo         $newContent = $content + [char]13 + [char]10 + $script + [char]13 + [char]10
echo     ^}
echo     [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.Encoding]::UTF8^)
echo     Write-Host ('  CHANGED: Injected volume script: ' + (Split-Path $filePath -Leaf^)^)
echo     exit 1
echo ^} catch ^{
echo     Write-Host ('  ERROR: Processing failed: ' + (Split-Path "%FILE_PATH%" -Leaf^) + ' - ' + $_.Exception.Message^)
echo     exit 3
echo ^}
) > "%TEMP_PS%"
if exist "%TEMP_PS%" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP_PS%"
    set RESULT=%errorlevel%
    del "%TEMP_PS%" 2>nul
) else (
    echo ERROR: Failed to create temporary PowerShell script
    set RESULT=3
)
exit /b %RESULT%

REM Function to process Ironsource HTML file
REM Returns: 1=changed, 2=skipped, 3=error
:process_ironsource_file
set "FILE_PATH=%~1"
set "TEMP_PS=%TEMP%\postprocess_ironsource_%RANDOM%.ps1"
(
echo $ErrorActionPreference='Stop'
echo try ^{
echo     $filePath = "%FILE_PATH%"
echo     $search = "window.super_html_channel = " + [char]34 + "ironsource" + [char]34
echo     $replace = "window.super_html_channel = " + [char]34 + "unity" + [char]34
echo     $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8^)
echo     if ($content -notmatch [regex]::Escape($search^)^) ^{
echo         Write-Host ('  SKIP: Pattern not found: ' + (Split-Path $filePath -Leaf^)^)
echo         exit 2
echo     ^}
echo     $newContent = $content -replace [regex]::Escape($search^), $replace
echo     if ($newContent -ne $content^) ^{
echo         [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.Encoding]::UTF8^)
echo         Write-Host ('  CHANGED: Replaced channel: ' + (Split-Path $filePath -Leaf^)^)
echo         exit 1
echo     ^}
echo     exit 2
echo ^} catch ^{
echo     Write-Host ('  ERROR: Processing failed: ' + (Split-Path "%FILE_PATH%" -Leaf^) + ' - ' + $_.Exception.Message^)
echo     exit 3
echo ^}
) > "%TEMP_PS%"
if exist "%TEMP_PS%" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP_PS%"
    set RESULT=%errorlevel%
    del "%TEMP_PS%" 2>nul
) else (
    echo ERROR: Failed to create temporary PowerShell script
    set RESULT=3
)
exit /b %RESULT%
