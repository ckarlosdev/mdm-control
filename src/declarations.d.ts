declare module "*.css";
declare module "*.scss";
declare module "*.sass";

/// <reference types="vite/client" />

// Archivo de declaraciones para activos estáticos
declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module 'react-stack-grid' {
  import { Component, ReactNode, CSSProperties } from 'react';

  export interface StackGridProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    gridRef?: (ref: any) => void;
    columnWidth: number | string;
    gutterWidth?: number;
    gutterHeight?: number;
    duration?: number;
    easing?: string;
    appearDelay?: number;
    appear?: any;
    appeared?: any;
    enter?: any;
    entered?: any;
    leaved?: any;
    units?: { length: string; angle: string };
    monitorImagesLoaded?: boolean;
    vendorPrefix?: boolean;
    onLayout?: () => void;
  }

  export default class StackGrid extends Component<StackGridProps> {}
  export const transitions: any;
}