declare module "motion/react" {
  export const motion: any;
  export function useSpring(value?: any, config?: any): any;
  export function useTransform(value: any, input: any, output: any): any;
  export function useMotionTemplate(strings: TemplateStringsArray, ...values: any[]): any;
  export interface PanInfo {
    velocity: { x: number; y: number };
    offset: { x: number; y: number };
  }
}
