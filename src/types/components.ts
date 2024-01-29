export interface DropdownOption{
    value: string | number,
    label: string,
    icon?: string,
    [key:string]: any
}

export type DropTrigger = 'click' | 'hover';

export type DropAlign = 'left' | 'center' | 'right';


export type ButtonType = 'primary' | 'default'|'solid' | 'dashed' | 'disabled' | 'border'

export type TabItem = {
    name: string,
    title: string,
    icon?: string
}

export type PanelMenuItem = {
    icon: string;
    route: '',
    id: number,
    hasBorder: boolean,
    selected: boolean
  }