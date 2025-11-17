# scripts/deploy-force.ps1
Param(
  [string] $PublishBranch = "gh-pages",   # change to "adaptive" if you want that as the publish branch
  [switch] $DryRun                        # pass -DryRun to run checks without pushing
)

set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "`n=== Deploy script start ===" -ForegroundColor Cyan

# 1) Check vite.config base
if (Test-Path "./vite.config.js") {
  $vite = Get-Content ./vite.config.js -Raw
  if ($vite -notmatch "base\s*:\s*['""]\/['""]") {
    Write-Warning "vite.config.js does not contain base: '/'. This is required for username.github.io sites. Please fix if your site is a user site."
  } else {
    Write-Host "vite.config.js base looks OK." -ForegroundColor Green
  }
} else {
  Write-Warning "vite.config.js not found. Continue assuming base is correct."
}

# 2) Build
Write-Host "`n> Running build (npm run build) ..." -ForegroundColor Cyan
npm run build

# 3) Stamp and 404
$ts = (Get-Date).ToString("o")
Write-Host "Creating dist/.deploy_stamp and dist/404.html" -ForegroundColor Cyan
Set-Content -Path "./dist/.deploy_stamp" -Value "deployed: $ts"
Copy-Item -Path "./dist/index.html" -Destination "./dist/404.html" -Force

# 4) Copy CNAME if repo root has one
if (Test-Path "./CNAME") {
  Write-Host "Found repo CNAME, copying into dist" -ForegroundColor Cyan
  Copy-Item -Path "./CNAME" -Destination "./dist/CNAME" -Force
}

# 5) Validate built index references assets (basic guard)
Write-Host "`n> Validating dist/index.html ..." -ForegroundColor Cyan
$indexText = Get-Content "./dist/index.html" -Raw
if ($indexText -match "/src/main.js") {
  Write-Error "dist/index.html looks like a development index (references /src/main.js). Aborting deploy."
  exit 1
}
if ($indexText -notmatch "/assets/") {
  Write-Warning "dist/index.html does not appear to reference /assets/. Proceeding but double-check output."
} else {
  Write-Host "dist/index.html references assets. OK." -ForegroundColor Green
}

# 6) Prepare temporary git repo inside dist
$oldLocation = Get-Location
Push-Location .\dist

# ensure no leftover .git
if (Test-Path ".git") {
  Write-Host "Removing existing .git in dist" -ForegroundColor Yellow
  Remove-Item -Recurse -Force .git
}

Write-Host "`n> Initialising temporary git repo in dist..." -ForegroundColor Cyan
git init

# create commit
git checkout -b $PublishBranch 2>$null

# add CNAME from dist if present (already copied above)
git add -A

# commit
git commit -m "Deploy: force update $PublishBranch - $ts" 2>$null

# show sha
# create and switch branch safely (works if branch exists or not)
$sha = git rev-parse --short HEAD
try {
  git rev-parse --verify $PublishBranch 2>$null
  $branchExists = $LASTEXITCODE -eq 0
} catch {
  $branchExists = $false
}

if ($branchExists) {
  Write-Host "Branch $PublishBranch exists — switching to it"
  git switch $PublishBranch 2>$null || git checkout $PublishBranch 2>$null
} else {
  Write-Host "Creating and switching to branch $PublishBranch"
  git switch -c $PublishBranch 2>$null || git checkout -b $PublishBranch 2>$null
}

# continue even if git printed warnings to stderr




# Write-Host "Prepared commit $sha in dist." -ForegroundColor Green

if ($DryRun) {
  Write-Host "`nDryRun requested. Not pushing. Cleaning up..." -ForegroundColor Yellow
  Pop-Location
  # remove temp .git
  if (Test-Path ".\dist\.git") { Remove-Item -Recurse -Force .\dist\.git }
  Write-Host "Dry run complete."
  exit 0
}

# 7) Set remote and force push
$remote = "origin"
$repoUrl = (git remote get-url origin) 2>$null
if (-not $repoUrl) {
  Write-Host "No origin remote visible. You must add remote or run script from a clone with origin set." -ForegroundColor Red
  Pop-Location
  exit 1
}
Write-Host "`n> Pushing dist -> $PublishBranch on $repoUrl (force push) ..." -ForegroundColor Cyan
git remote remove $remote 2>$null
git remote add $remote $repoUrl
git push -f $remote $PublishBranch

Write-Host "`nPushed commit $sha to $remote/$PublishBranch" -ForegroundColor Green

# 8) Cleanup
Pop-Location
# remove temp .git in dist to keep working tree clean (if any)
if (Test-Path ".\dist\.git") { Remove-Item -Recurse -Force .\dist\.git }

Write-Host "`n=== Deploy finished: $sha -> $PublishBranch ===" -ForegroundColor Cyan
Write-Host "Tip: if Pages still serves older content, force a rebuild by making an empty commit on the published branch or toggling Pages source in GitHub settings." -ForegroundColor Yellow
