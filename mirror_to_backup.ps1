# mirror_to_backup.ps1
# Mirrors D:\Improv-Comedy-App to G:\Improv-Comedy-App (Google Drive)
#
# NOTE: G:\ is a Google Drive virtual drive. This script copies files there
# but Google Drive handles cloud sync automatically. You do not need to run
# this unless you want a manual local-to-Drive push outside of Google Drive sync.
#
# SAFE by default:
#   /E  — copies all subfolders including empty ones
#   /XO — skips destination files that are newer (no accidental overwrites)
#   No /MIR — WARNING: /MIR would DELETE files in destination that are not in source.
#              Only add /MIR if you deliberately want destructive mirroring.

$source = "D:\Improv-Comedy-App"
$dest   = "G:\Improv-Comedy-App"
$log    = "D:\Improv-Comedy-App\mirror_log.txt"

Write-Host "Starting safe mirror: $source -> $dest"
Write-Host "Log: $log"

robocopy $source $dest /E /XO /LOG+:$log /TEE

Write-Host "Mirror complete. Check mirror_log.txt for details."
