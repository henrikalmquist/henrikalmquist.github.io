# scripts/deploy.ps1
Param()
set-StrictMode -Version Latest
Write-Host "Building site..."
npm run build

# prepare deploy worktree
git fetch origin
$deploy = "$env:TEMP\adaptive_deploy"

if (Test-Path $deploy) {
  Write-Host "Removing existing worktree at $deploy"
  git worktree remove $deploy -f 2>$null
  Remove-Item -Recurse -Force $deploy
}

Write-Host "Creating worktree for origin/adaptive at $deploy"
git worktree add $deploy origin/adaptive

# wipe the worktree (but keep .git)
Write-Host "Cleaning worktree contents..."
Get-ChildItem -Path $deploy -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force

# copy built files
Write-Host "Copying dist into worktree..."
Copy-Item -Path ".\dist\*" -Destination $deploy -Recurse -Force

# commit and push
Push-Location $deploy
git add -A
$changed = (git status --porcelain)
if ($changed) {
  git commit -m "Deploy: update adaptive branch"
  git push origin adaptive
  Write-Host "Pushed adaptive"
} else {
  Write-Host "No changes to commit"
}
Pop-Location

# cleanup
git worktree remove $deploy -f
if (Test-Path $deploy) { Remove-Item -Recurse -Force $deploy }
Write-Host "Deploy finished."
