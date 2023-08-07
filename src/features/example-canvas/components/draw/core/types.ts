import Figure from "@src/features/example-canvas/components/draw/core/elements/figure";

export type ScrollParams = {
  x?: number,
  y?: number,
  dx?: number,
  dy?: number
}

export type ZoomParams = {
  center: Point,
  zoom?: number,
  delta?: number,
}

export type Point = {
  x: number,
  y: number
}

export type Rect = {
  x1: number,
  y1: number,
  x2: number,
  y2: number
}

export type Action = {
  name: string,
  x: number,
  y: number,
  targetX: number,
  targetY: number,
  element?: Figure
};
