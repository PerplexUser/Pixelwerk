; Generated from the exact packaged files. Never recursively delete the install directory.
!macro PixelwerkRemoveInstalledFiles
StrCpy $R9 "0"
IfFileExists "$INSTDIR\Benutzerhandbuch-DE-EN.md" 0 pw_keep_0
ClearErrors
Delete "$INSTDIR\Benutzerhandbuch-DE-EN.md"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_0:
IfFileExists "$INSTDIR\chrome_100_percent.pak" 0 pw_keep_1
ClearErrors
Delete "$INSTDIR\chrome_100_percent.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_1:
IfFileExists "$INSTDIR\chrome_200_percent.pak" 0 pw_keep_2
ClearErrors
Delete "$INSTDIR\chrome_200_percent.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_2:
IfFileExists "$INSTDIR\d3dcompiler_47.dll" 0 pw_keep_3
ClearErrors
Delete "$INSTDIR\d3dcompiler_47.dll"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_3:
IfFileExists "$INSTDIR\dxcompiler.dll" 0 pw_keep_4
ClearErrors
Delete "$INSTDIR\dxcompiler.dll"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_4:
IfFileExists "$INSTDIR\electron_wer.dll" 0 pw_keep_5
ClearErrors
Delete "$INSTDIR\electron_wer.dll"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_5:
IfFileExists "$INSTDIR\ffmpeg.dll" 0 pw_keep_6
ClearErrors
Delete "$INSTDIR\ffmpeg.dll"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_6:
IfFileExists "$INSTDIR\icudtl.dat" 0 pw_keep_7
ClearErrors
Delete "$INSTDIR\icudtl.dat"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_7:
IfFileExists "$INSTDIR\LICENSE.electron.txt" 0 pw_keep_8
ClearErrors
Delete "$INSTDIR\LICENSE.electron.txt"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_8:
IfFileExists "$INSTDIR\LICENSES.chromium.html" 0 pw_keep_9
ClearErrors
Delete "$INSTDIR\LICENSES.chromium.html"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_9:
IfFileExists "$INSTDIR\locales\af.pak" 0 pw_keep_10
ClearErrors
Delete "$INSTDIR\locales\af.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_10:
IfFileExists "$INSTDIR\locales\am.pak" 0 pw_keep_11
ClearErrors
Delete "$INSTDIR\locales\am.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_11:
IfFileExists "$INSTDIR\locales\ar.pak" 0 pw_keep_12
ClearErrors
Delete "$INSTDIR\locales\ar.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_12:
IfFileExists "$INSTDIR\locales\bg.pak" 0 pw_keep_13
ClearErrors
Delete "$INSTDIR\locales\bg.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_13:
IfFileExists "$INSTDIR\locales\bn.pak" 0 pw_keep_14
ClearErrors
Delete "$INSTDIR\locales\bn.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_14:
IfFileExists "$INSTDIR\locales\ca.pak" 0 pw_keep_15
ClearErrors
Delete "$INSTDIR\locales\ca.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_15:
IfFileExists "$INSTDIR\locales\cs.pak" 0 pw_keep_16
ClearErrors
Delete "$INSTDIR\locales\cs.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_16:
IfFileExists "$INSTDIR\locales\da.pak" 0 pw_keep_17
ClearErrors
Delete "$INSTDIR\locales\da.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_17:
IfFileExists "$INSTDIR\locales\de.pak" 0 pw_keep_18
ClearErrors
Delete "$INSTDIR\locales\de.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_18:
IfFileExists "$INSTDIR\locales\el.pak" 0 pw_keep_19
ClearErrors
Delete "$INSTDIR\locales\el.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_19:
IfFileExists "$INSTDIR\locales\en-GB.pak" 0 pw_keep_20
ClearErrors
Delete "$INSTDIR\locales\en-GB.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_20:
IfFileExists "$INSTDIR\locales\en-US.pak" 0 pw_keep_21
ClearErrors
Delete "$INSTDIR\locales\en-US.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_21:
IfFileExists "$INSTDIR\locales\es-419.pak" 0 pw_keep_22
ClearErrors
Delete "$INSTDIR\locales\es-419.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_22:
IfFileExists "$INSTDIR\locales\es.pak" 0 pw_keep_23
ClearErrors
Delete "$INSTDIR\locales\es.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_23:
IfFileExists "$INSTDIR\locales\et.pak" 0 pw_keep_24
ClearErrors
Delete "$INSTDIR\locales\et.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_24:
IfFileExists "$INSTDIR\locales\fa.pak" 0 pw_keep_25
ClearErrors
Delete "$INSTDIR\locales\fa.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_25:
IfFileExists "$INSTDIR\locales\fi.pak" 0 pw_keep_26
ClearErrors
Delete "$INSTDIR\locales\fi.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_26:
IfFileExists "$INSTDIR\locales\fil.pak" 0 pw_keep_27
ClearErrors
Delete "$INSTDIR\locales\fil.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_27:
IfFileExists "$INSTDIR\locales\fr.pak" 0 pw_keep_28
ClearErrors
Delete "$INSTDIR\locales\fr.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_28:
IfFileExists "$INSTDIR\locales\gu.pak" 0 pw_keep_29
ClearErrors
Delete "$INSTDIR\locales\gu.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_29:
IfFileExists "$INSTDIR\locales\he.pak" 0 pw_keep_30
ClearErrors
Delete "$INSTDIR\locales\he.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_30:
IfFileExists "$INSTDIR\locales\hi.pak" 0 pw_keep_31
ClearErrors
Delete "$INSTDIR\locales\hi.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_31:
IfFileExists "$INSTDIR\locales\hr.pak" 0 pw_keep_32
ClearErrors
Delete "$INSTDIR\locales\hr.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_32:
IfFileExists "$INSTDIR\locales\hu.pak" 0 pw_keep_33
ClearErrors
Delete "$INSTDIR\locales\hu.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_33:
IfFileExists "$INSTDIR\locales\id.pak" 0 pw_keep_34
ClearErrors
Delete "$INSTDIR\locales\id.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_34:
IfFileExists "$INSTDIR\locales\it.pak" 0 pw_keep_35
ClearErrors
Delete "$INSTDIR\locales\it.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_35:
IfFileExists "$INSTDIR\locales\ja.pak" 0 pw_keep_36
ClearErrors
Delete "$INSTDIR\locales\ja.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_36:
IfFileExists "$INSTDIR\locales\kn.pak" 0 pw_keep_37
ClearErrors
Delete "$INSTDIR\locales\kn.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_37:
IfFileExists "$INSTDIR\locales\ko.pak" 0 pw_keep_38
ClearErrors
Delete "$INSTDIR\locales\ko.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_38:
IfFileExists "$INSTDIR\locales\lt.pak" 0 pw_keep_39
ClearErrors
Delete "$INSTDIR\locales\lt.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_39:
IfFileExists "$INSTDIR\locales\lv.pak" 0 pw_keep_40
ClearErrors
Delete "$INSTDIR\locales\lv.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_40:
IfFileExists "$INSTDIR\locales\ml.pak" 0 pw_keep_41
ClearErrors
Delete "$INSTDIR\locales\ml.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_41:
IfFileExists "$INSTDIR\locales\mr.pak" 0 pw_keep_42
ClearErrors
Delete "$INSTDIR\locales\mr.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_42:
IfFileExists "$INSTDIR\locales\ms.pak" 0 pw_keep_43
ClearErrors
Delete "$INSTDIR\locales\ms.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_43:
IfFileExists "$INSTDIR\locales\nb.pak" 0 pw_keep_44
ClearErrors
Delete "$INSTDIR\locales\nb.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_44:
IfFileExists "$INSTDIR\locales\nl.pak" 0 pw_keep_45
ClearErrors
Delete "$INSTDIR\locales\nl.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_45:
IfFileExists "$INSTDIR\locales\pl.pak" 0 pw_keep_46
ClearErrors
Delete "$INSTDIR\locales\pl.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_46:
IfFileExists "$INSTDIR\locales\pt-BR.pak" 0 pw_keep_47
ClearErrors
Delete "$INSTDIR\locales\pt-BR.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_47:
IfFileExists "$INSTDIR\locales\pt-PT.pak" 0 pw_keep_48
ClearErrors
Delete "$INSTDIR\locales\pt-PT.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_48:
IfFileExists "$INSTDIR\locales\ro.pak" 0 pw_keep_49
ClearErrors
Delete "$INSTDIR\locales\ro.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_49:
IfFileExists "$INSTDIR\locales\ru.pak" 0 pw_keep_50
ClearErrors
Delete "$INSTDIR\locales\ru.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_50:
IfFileExists "$INSTDIR\locales\sk.pak" 0 pw_keep_51
ClearErrors
Delete "$INSTDIR\locales\sk.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_51:
IfFileExists "$INSTDIR\locales\sl.pak" 0 pw_keep_52
ClearErrors
Delete "$INSTDIR\locales\sl.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_52:
IfFileExists "$INSTDIR\locales\sr.pak" 0 pw_keep_53
ClearErrors
Delete "$INSTDIR\locales\sr.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_53:
IfFileExists "$INSTDIR\locales\sv.pak" 0 pw_keep_54
ClearErrors
Delete "$INSTDIR\locales\sv.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_54:
IfFileExists "$INSTDIR\locales\sw.pak" 0 pw_keep_55
ClearErrors
Delete "$INSTDIR\locales\sw.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_55:
IfFileExists "$INSTDIR\locales\ta.pak" 0 pw_keep_56
ClearErrors
Delete "$INSTDIR\locales\ta.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_56:
IfFileExists "$INSTDIR\locales\te.pak" 0 pw_keep_57
ClearErrors
Delete "$INSTDIR\locales\te.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_57:
IfFileExists "$INSTDIR\locales\th.pak" 0 pw_keep_58
ClearErrors
Delete "$INSTDIR\locales\th.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_58:
IfFileExists "$INSTDIR\locales\tr.pak" 0 pw_keep_59
ClearErrors
Delete "$INSTDIR\locales\tr.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_59:
IfFileExists "$INSTDIR\locales\uk.pak" 0 pw_keep_60
ClearErrors
Delete "$INSTDIR\locales\uk.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_60:
IfFileExists "$INSTDIR\locales\ur.pak" 0 pw_keep_61
ClearErrors
Delete "$INSTDIR\locales\ur.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_61:
IfFileExists "$INSTDIR\locales\vi.pak" 0 pw_keep_62
ClearErrors
Delete "$INSTDIR\locales\vi.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_62:
IfFileExists "$INSTDIR\locales\zh-CN.pak" 0 pw_keep_63
ClearErrors
Delete "$INSTDIR\locales\zh-CN.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_63:
IfFileExists "$INSTDIR\locales\zh-TW.pak" 0 pw_keep_64
ClearErrors
Delete "$INSTDIR\locales\zh-TW.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_64:
IfFileExists "$INSTDIR\Pixelwerk-LICENSE.txt" 0 pw_keep_65
ClearErrors
Delete "$INSTDIR\Pixelwerk-LICENSE.txt"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_65:
IfFileExists "$INSTDIR\Pixelwerk.exe" 0 pw_keep_66
ClearErrors
Delete "$INSTDIR\Pixelwerk.exe"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_66:
IfFileExists "$INSTDIR\resources\app.asar" 0 pw_keep_67
ClearErrors
Delete "$INSTDIR\resources\app.asar"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_67:
IfFileExists "$INSTDIR\resources\build-mode.json" 0 pw_keep_68
ClearErrors
Delete "$INSTDIR\resources\build-mode.json"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_68:
IfFileExists "$INSTDIR\resources.pak" 0 pw_keep_69
ClearErrors
Delete "$INSTDIR\resources.pak"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_69:
IfFileExists "$INSTDIR\snapshot_blob.bin" 0 pw_keep_70
ClearErrors
Delete "$INSTDIR\snapshot_blob.bin"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_70:
IfFileExists "$INSTDIR\v8_context_snapshot.bin" 0 pw_keep_71
ClearErrors
Delete "$INSTDIR\v8_context_snapshot.bin"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_71:
IfFileExists "$INSTDIR\vk_swiftshader_icd.json" 0 pw_keep_72
ClearErrors
Delete "$INSTDIR\vk_swiftshader_icd.json"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_72:
IfFileExists "$INSTDIR\vk_swiftshader.dll" 0 pw_keep_73
ClearErrors
Delete "$INSTDIR\vk_swiftshader.dll"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_73:
IfFileExists "$INSTDIR\vulkan-1.dll" 0 pw_keep_74
ClearErrors
Delete "$INSTDIR\vulkan-1.dll"
IfErrors 0 +2
StrCpy $R9 "1"
pw_keep_74:
${If} $R9 == "1"
  MessageBox MB_ICONSTOP|MB_OK "Programmdateien sind noch belegt. Schließe Pixelwerk und starte das Setup erneut. / Program files are still in use. Close Pixelwerk and run Setup again."
  Abort
${EndIf}
Delete "$INSTDIR\${UNINSTALL_FILENAME}"
RMDir "$INSTDIR\resources"
RMDir "$INSTDIR\locales"
RMDir "$INSTDIR"
!macroend
