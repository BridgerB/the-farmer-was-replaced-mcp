param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "stop", "status")]
    [string]$Action
)

Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Threading;

public class GameControl {
    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [DllImport("user32.dll")]
    public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);

    [DllImport("user32.dll")]
    public static extern bool IsIconic(IntPtr hWnd);

    public const int SW_RESTORE = 9;
    public const byte VK_F5 = 0x74;
    public const byte VK_SHIFT = 0x10;
    public const uint KEYEVENTF_KEYUP = 0x0002;

    public static bool FocusWindow(IntPtr hWnd) {
        if (IsIconic(hWnd)) {
            ShowWindow(hWnd, SW_RESTORE);
            Thread.Sleep(100);
        }
        return SetForegroundWindow(hWnd);
    }

    public static void SendF5() {
        keybd_event(VK_F5, 0x3F, 0, UIntPtr.Zero);
        Thread.Sleep(100);
        keybd_event(VK_F5, 0x3F, KEYEVENTF_KEYUP, UIntPtr.Zero);
    }

    public static void SendShiftF5() {
        keybd_event(VK_SHIFT, 0x2A, 0, UIntPtr.Zero);
        Thread.Sleep(50);
        keybd_event(VK_F5, 0x3F, 0, UIntPtr.Zero);
        Thread.Sleep(100);
        keybd_event(VK_F5, 0x3F, KEYEVENTF_KEYUP, UIntPtr.Zero);
        Thread.Sleep(50);
        keybd_event(VK_SHIFT, 0x2A, KEYEVENTF_KEYUP, UIntPtr.Zero);
    }
}
"@

$proc = Get-Process | Where-Object { $_.MainWindowTitle -like "*Farmer*" } | Select-Object -First 1

if (-not $proc) {
    Write-Output "ERROR: Game not found"
    exit 1
}

$hwnd = $proc.MainWindowHandle

switch ($Action) {
    "start" {
        [GameControl]::FocusWindow($hwnd) | Out-Null
        Start-Sleep -Milliseconds 200
        [GameControl]::SendF5()
        Write-Output "OK: Started"
    }
    "stop" {
        [GameControl]::FocusWindow($hwnd) | Out-Null
        Start-Sleep -Milliseconds 200
        [GameControl]::SendShiftF5()
        Write-Output "OK: Stopped"
    }
    "status" {
        Write-Output "OK: Game running (PID: $($proc.Id))"
        $outputFile = "$env:APPDATA\..\LocalLow\TheFarmerWasReplaced\TheFarmerWasReplaced\output.txt"
        if (Test-Path $outputFile) {
            Get-Content $outputFile | Select-Object -Last 5
        }
    }
}
