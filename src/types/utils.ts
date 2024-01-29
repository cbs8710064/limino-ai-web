export type SystemName = 'Windows' | 'Mac' | 'UNIX' | 'Linux' | 'IOS' | 'Android' |'Other'
export type SystemInfo = {
    osName: SystemName,
    isAndroid: boolean,
    isIOS: boolean;
    isWin: boolean;
    isMac: boolean;
    isPC: boolean;
}
