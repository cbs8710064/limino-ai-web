export type BackTopOptions = {
    right: string | number;
    bottom: string | number;
    activityTop?: number
}

export type MessageAlign = 'left' | 'center' | 'right'
export type MessageType = 'info' | 'warning' | 'error' | 'success' | 'loading';
export type MessageOptions = {
    icon?: string;
    message?: string;
    type?: MessageType;
    duration?: number;
    id?: string;
    hasClose?: boolean
}

export type MessageFun = (msg: string) => Function

export interface MessageOpenFuns {
    warning: MessageFun;
    error: MessageFun;
    loading: MessageFun;
    success: MessageFun;
    info: MessageFun;
    clear: () => void;
    open(opt: MessageOpenFuns): Function
}


export type NoticeFun = (opt:NoticeOpenOpts) => Function
export interface NoticeOpenFuns {
    warning: NoticeFun;
    error: NoticeFun;
    loading: NoticeFun;
    success: NoticeFun;
    info: NoticeFun;
    clear: () => void;
    open(opt: NoticeOpenFuns): Function
}
export interface NoticeOption extends MessageOptions {
    title: string
} 

export interface NoticeOpenOpts {
    title: string;
    description: string;
}