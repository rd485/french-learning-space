# set_llm_key.ps1 - Store your LLM API key in a local hidden file (outside the project, not committed)
#
# Usage (in PowerShell, any directory):
#   powershell -ExecutionPolicy Bypass -File ".\set_llm_key.ps1"
#   powershell -ExecutionPolicy Bypass -File ".\set_llm_key.ps1" -Clear
#
# The API Key is entered without echo and saved only on this machine:
#   $env:USERPROFILE\.french-llm-key   (i.e. C:\Users\<you>\.french-llm-key)
# server.py re-reads this file on every request, so no restart is needed.

param(
  [switch]$Clear
)

$ErrorActionPreference = "Stop"
$KeyFile = Join-Path $env:USERPROFILE ".french-llm-key"

if ($Clear) {
  if (Test-Path $KeyFile) {
    Remove-Item $KeyFile -Force
    Write-Host "Removed key file: $KeyFile"
  } else {
    Write-Host "(No key file found, nothing to remove)"
  }
  exit 0
}

Write-Host "=== Set local hidden LLM Key ==="
Write-Host "(Key input is hidden; saved only on this machine: $KeyFile)"
Write-Host "(This file lives outside the project and will not be committed or uploaded)"
Write-Host ""

$secure = Read-Host -AsSecureString "Enter LLM API Key"
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$apiKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
if ([string]::IsNullOrWhiteSpace($apiKey)) {
  Write-Error "Error: Key cannot be empty. Aborted."
  exit 1
}

$baseUrl = Read-Host "Base URL [default https://api.openai.com/v1]"
if ([string]::IsNullOrWhiteSpace($baseUrl)) { $baseUrl = "https://api.openai.com/v1" }

$model = Read-Host "Model [default gpt-4o-mini]"
if ([string]::IsNullOrWhiteSpace($model)) { $model = "gpt-4o-mini" }

@"
# Local LLM config (auto-generated, do not commit)
LLM_API_KEY=$apiKey
LLM_BASE_URL=$baseUrl
LLM_MODEL=$model
"@ | Set-Content -Path $KeyFile -Encoding UTF8

try {
  icacls "$KeyFile" /inheritance:r /grant:r "${env:USERNAME}:F" > $null
  Write-Host "File permissions set to current user only."
} catch {
  Write-Host "(Note: could not set file permissions, but the file is still at $KeyFile)"
}

Write-Host ""
Write-Host "Saved to: $KeyFile"
Write-Host "server.py re-reads this file on every request - just refresh the page, no restart needed."
