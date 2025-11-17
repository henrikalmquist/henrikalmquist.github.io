Param()
set-StrictMode -Version Latest
Write-Host "Building site..."
npm run build

# add small stamp to force a change each deploy
$ts = (Get-Date).ToString("o")
Set-Content -Path "./dist/.deploy_stamp" -Value "deployed: $ts"

# also add 404 fallback
Copy-Item -Path "./dist/index.html" -Destination "./dist/404.html" -Force

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

# ensure we have a 404 fallback in branch as well
Copy-Item -Path "$deploy\index.html" -Destination "$deploy\404.html" -Force

# commit and push
Push-Location $deploy
git add -A
$changed = (git status --porcelain)
if ($changed) {
  git commit -m "Deploy: update adaptive branch - $ts"
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
