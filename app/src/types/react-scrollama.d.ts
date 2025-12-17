declare module "react-scrollama" {
  import * as React from "react";

  export interface ScrollamaProps<T = unknown> {
    children?: React.ReactNode;
    offset?: number;
    onStepEnter?: (args: { data: T }) => void;
    onStepExit?: (args: { data: T }) => void;
    debug?: boolean;
  }

  export interface StepProps<T = unknown> {
    data: T;
    children?: React.ReactNode;
  }

  export function Scrollama<T = unknown>(
    props: ScrollamaProps<T>
  ): React.ReactElement | null;

  export function Step<T = unknown>(
    props: StepProps<T>
  ): React.ReactElement | null;
}
