# Exit on error
$ErrorActionPreference = "Stop"

Write-Host "=== Building Vite project ==="
npm run build

Write-Host "=== Switching to gh-pages branch ==="
git switch gh-pages

Write-Host "=== Cleaning old deployment ==="
Get-ChildItem -Exclude .git -Recurse | Remove-Item -Recurse -Force

Write-Host "=== Copying new dist build ==="
Copy-Item -Path "../dist/*" -Destination "./" -Recurse -Force

Write-Host "=== Adding and committing changes ==="
git add .
git commit -m "Deploy updated site" --allow-empty

Write-Host "=== Pushing ==="
git push origin gh-pages

Write-Host "=== Switching back to adaptive ==="
git switch adaptive

Write-Host "=== Deployment complete ==="
