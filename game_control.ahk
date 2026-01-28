; Move to monitor 2 (X=2560+), click, then F5/Shift+F5
#Requires AutoHotkey v2.0

action := A_Args.Length > 0 ? A_Args[1] : "start"

; Monitor 2 starts at X=2560, center would be ~3840, Y=720
targetX := 3840
targetY := 720

if (action = "status") {
    if WinExist("ahk_exe TheFarmerWasReplaced.exe") {
        FileAppend "OK: Game running`n", "*"
    } else {
        FileAppend "ERROR: Game not found`n", "*"
        ExitApp 1
    }
    ExitApp 0
}

if !WinExist("ahk_exe TheFarmerWasReplaced.exe") {
    FileAppend "ERROR: Game not found`n", "*"
    ExitApp 1
}

MouseMove targetX, targetY, 0
Sleep 200
Click
Sleep 300

if (action = "stop") {
    Send "{Shift down}"
    Sleep 100
    Send "{F5}"
    Sleep 100
    Send "{Shift up}"
    FileAppend "OK: Stopped`n", "*"
} else {
    Send "{F5}"
    FileAppend "OK: Started`n", "*"
}

ExitApp 0
