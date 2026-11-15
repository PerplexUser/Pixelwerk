; Per-user application registration. Windows owns the user's default choice.
!define PIXELWERK_PROGID "Pixelwerk.Image"
!define PIXELWERK_CAPABILITIES "Software\Pixelwerk\Capabilities"

!macro PixelwerkRegisterExtension EXT
  WriteRegStr HKCU "${PIXELWERK_CAPABILITIES}\FileAssociations" ".${EXT}" "${PIXELWERK_PROGID}"
  WriteRegStr HKCU "Software\Classes\.${EXT}\OpenWithProgids" "${PIXELWERK_PROGID}" ""
  WriteRegStr HKCU "Software\Classes\Applications\Pixelwerk.exe\SupportedTypes" ".${EXT}" ""
!macroend

!macro PixelwerkRegisterImages
  SetRegView 64
  WriteRegStr HKCU "Software\Classes\${PIXELWERK_PROGID}" "" "Pixelwerk Image"
  WriteRegStr HKCU "Software\Classes\${PIXELWERK_PROGID}\DefaultIcon" "" '$\"$INSTDIR\Pixelwerk.exe$\",0'
  WriteRegStr HKCU "Software\Classes\${PIXELWERK_PROGID}\shell\open\command" "" '$\"$INSTDIR\Pixelwerk.exe$\" $\"%1$\"'
  WriteRegStr HKCU "Software\Classes\Applications\Pixelwerk.exe" "FriendlyAppName" "Pixelwerk"
  WriteRegStr HKCU "Software\Classes\Applications\Pixelwerk.exe\shell\open\command" "" '$\"$INSTDIR\Pixelwerk.exe$\" $\"%1$\"'
  WriteRegStr HKCU "${PIXELWERK_CAPABILITIES}" "ApplicationName" "Pixelwerk"
  WriteRegStr HKCU "${PIXELWERK_CAPABILITIES}" "ApplicationDescription" "Pixelwerk - local PNG, JPG and BMP image editor"
  WriteRegStr HKCU "${PIXELWERK_CAPABILITIES}" "ApplicationIcon" '$\"$INSTDIR\Pixelwerk.exe$\",0'
  !insertmacro PixelwerkRegisterExtension "png"
  !insertmacro PixelwerkRegisterExtension "jpg"
  !insertmacro PixelwerkRegisterExtension "jpeg"
  !insertmacro PixelwerkRegisterExtension "bmp"
  WriteRegStr HKCU "Software\RegisteredApplications" "Pixelwerk" "${PIXELWERK_CAPABILITIES}"
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, p 0, p 0)'
!macroend

!macro PixelwerkUnregisterExtension EXT
  DeleteRegValue HKCU "Software\Classes\.${EXT}\OpenWithProgids" "${PIXELWERK_PROGID}"
  DeleteRegKey /ifempty HKCU "Software\Classes\.${EXT}\OpenWithProgids"
  DeleteRegKey /ifempty HKCU "Software\Classes\.${EXT}"
!macroend

!macro PixelwerkUnregisterImages
  ; Keep the stable ProgID during upgrades so existing Windows choices survive.
  ${IfNot} ${isUpdated}
    SetRegView 64
    ReadRegStr $0 HKCU "Software\Classes\${PIXELWERK_PROGID}\shell\open\command" ""
    ${If} $0 == '$\"$INSTDIR\Pixelwerk.exe$\" $\"%1$\"'
      !insertmacro PixelwerkUnregisterExtension "png"
      !insertmacro PixelwerkUnregisterExtension "jpg"
      !insertmacro PixelwerkUnregisterExtension "jpeg"
      !insertmacro PixelwerkUnregisterExtension "bmp"
      DeleteRegKey HKCU "Software\Classes\${PIXELWERK_PROGID}"
      DeleteRegKey HKCU "${PIXELWERK_CAPABILITIES}"
      DeleteRegValue HKCU "Software\RegisteredApplications" "Pixelwerk"
    ${EndIf}
    ReadRegStr $0 HKCU "Software\Classes\Applications\Pixelwerk.exe\shell\open\command" ""
    ${If} $0 == '$\"$INSTDIR\Pixelwerk.exe$\" $\"%1$\"'
      DeleteRegKey HKCU "Software\Classes\Applications\Pixelwerk.exe"
    ${EndIf}
    System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, p 0, p 0)'
  ${EndIf}
!macroend
