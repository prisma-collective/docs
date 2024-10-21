@echo off
:: setup.bat: Installs pre-commit and sets up Git hooks for Windows

:: Check if Python is installed
where python >nul 2>nul
IF ERRORLEVEL 1 (
    echo Python is not installed. Please install Python and try again.
    exit /b 1
)

:: Install pre-commit
python -m pip install pre-commit

:: Install the pre-commit hooks
pre-commit install

:: Success message
echo Setup complete. Pre-commit hooks are installed and Markdown linting is enabled.
