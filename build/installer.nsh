; Per-user shortcuts and image registration; personal images are never deleted.
!include "nsDialogs.nsh"
!include "LogicLib.nsh"
!include "MUI2.nsh"
!include "${BUILD_RESOURCES_DIR}/file-associations.nsh"
!ifndef BUILD_UNINSTALLER
Var PixelwerkDesktopCheck
Var PixelwerkDesktopWanted
Var PixelwerkDefaultsOpened
LangString PixelwerkLinks 1031 "Verknüpfungen"
LangString PixelwerkLinks 1033 "Shortcuts"
LangString PixelwerkLinksText 1031 "Pixelwerk im Startmenü und optional auf dem Desktop."
LangString PixelwerkLinksText 1033 "Pixelwerk in the Start menu and optionally on the desktop."
LangString PixelwerkDesktopText 1031 "Desktop-Verknüpfung erstellen"
LangString PixelwerkDesktopText 1033 "Create a desktop shortcut"

LangString PixelwerkDefaultsTitle 1031 "Pixelwerk als Standard-App"
LangString PixelwerkDefaultsTitle 1033 "Pixelwerk as your default app"
LangString PixelwerkDefaultsSubtitle 1031 "PNG, JPG, JPEG und BMP mit Pixelwerk öffnen."
LangString PixelwerkDefaultsSubtitle 1033 "Open PNG, JPG, JPEG and BMP with Pixelwerk."
LangString PixelwerkDefaultsText 1031 "Pixelwerk ist für diese Bildtypen registriert. Windows verlangt deine Bestätigung für die Standard-App. Wähle in den geöffneten Einstellungen Pixelwerk für .png, .jpg, .jpeg und .bmp. Unter Windows 10 findest du dies unter Standard-Apps nach Dateityp auswählen. Kehre danach zum Setup zurück und klicke auf Weiter."
LangString PixelwerkDefaultsText 1033 "Pixelwerk is registered for these image types. Windows requires you to confirm the default app. In the Settings window, select Pixelwerk for .png, .jpg, .jpeg and .bmp. On Windows 10, use Choose default apps by file type. Then return to Setup and click Next."
LangString PixelwerkDefaultsButton 1031 "Windows-Standard-Apps öffnen"
LangString PixelwerkDefaultsButton 1033 "Open Windows default apps"
LangString PixelwerkDefaultsError 1031 "Öffne Windows-Einstellungen > Apps > Standard-Apps und wähle Pixelwerk für PNG, JPG, JPEG und BMP."
LangString PixelwerkDefaultsError 1033 "Open Windows Settings > Apps > Default apps and select Pixelwerk for PNG, JPG, JPEG and BMP."

!macro customFinishPage
  Page custom PixelwerkDefaultsPage
  !define MUI_FINISHPAGE_RUN
  !define MUI_FINISHPAGE_RUN_FUNCTION "PixelwerkStartApp"
  !insertmacro MUI_PAGE_FINISH
!macroend
!macro customPageAfterChangeDir
  Page custom PixelwerkLinksPage PixelwerkLinksLeave
!macroend
!macro customHeader
Function PixelwerkStartApp
  ${StdUtils.ExecShellAsUser} $0 "$launchLink" "open" ""
FunctionEnd
Function PixelwerkOpenDefaults
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows NT\CurrentVersion" "CurrentBuildNumber"
  ClearErrors
  ${If} $0 >= 22000
    ExecShell "open" "ms-settings:defaultapps?registeredAppUser=Pixelwerk"
  ${Else}
    ExecShell "open" "ms-settings:defaultapps"
  ${EndIf}
  ${If} ${Errors}
    MessageBox MB_OK|MB_ICONINFORMATION "$(PixelwerkDefaultsError)"
  ${EndIf}
FunctionEnd
Function PixelwerkDefaultsClicked
  Pop $0
  Call PixelwerkOpenDefaults
FunctionEnd
Function PixelwerkDefaultsPage
  !insertmacro MUI_HEADER_TEXT "$(PixelwerkDefaultsTitle)" "$(PixelwerkDefaultsSubtitle)"
  nsDialogs::Create 1018
  Pop $0
  ${If} $0 == error
    Abort
  ${EndIf}
  ${NSD_CreateLabel} 0 5u 100% 75u "$(PixelwerkDefaultsText)"
  Pop $0
  ${NSD_CreateButton} 0 90u 100% 18u "$(PixelwerkDefaultsButton)"
  Pop $0
  ${NSD_OnClick} $0 PixelwerkDefaultsClicked
  ${If} $PixelwerkDefaultsOpened != "1"
    StrCpy $PixelwerkDefaultsOpened "1"
    Call PixelwerkOpenDefaults
  ${EndIf}
  nsDialogs::Show
FunctionEnd
Function PixelwerkLinksPage
  !insertmacro MUI_HEADER_TEXT "$(PixelwerkLinks)" "$(PixelwerkLinksText)"
  nsDialogs::Create 1018
  Pop $0
  ${If} $0 == error
    Abort
  ${EndIf}
  ${NSD_CreateCheckbox} 0 15u 100% 14u "$(PixelwerkDesktopText)"
  Pop $PixelwerkDesktopCheck
  ${NSD_SetState} $PixelwerkDesktopCheck $PixelwerkDesktopWanted
  nsDialogs::Show
FunctionEnd
Function PixelwerkLinksLeave
  ${NSD_GetState} $PixelwerkDesktopCheck $PixelwerkDesktopWanted
FunctionEnd
!macroend
!macro customInstall
  !insertmacro PixelwerkRegisterImages
  ${If} $PixelwerkDesktopWanted == ${BST_CHECKED}
    CreateShortCut "$DESKTOP\Pixelwerk.lnk" "$INSTDIR\Pixelwerk.exe"
  ${EndIf}
!macroend
!endif
!macro customUnInstall
  !insertmacro PixelwerkUnregisterImages
  Delete "$DESKTOP\Pixelwerk.lnk"
!macroend
!macro customRemoveFiles
  SetOutPath $TEMP
  !include "${BUILD_RESOURCES_DIR}/installed-files.nsh"
  !insertmacro PixelwerkRemoveInstalledFiles
!macroend
