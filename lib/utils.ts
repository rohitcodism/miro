import { CanvasState, Layer } from './../Types/Canvas';
import { Camera, Color, Point, Side, XYWH } from "@/Types/Canvas";
import { useMutation } from "@/liveblocks.config";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge";

const colors = [
  '#DC2626',
  '#D97706',
  '#059669',
  '#7C3AED',
  '#DB2777'
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function connectionIdToColor(connectionId: number): string {
  return colors[connectionId % colors.length];
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y
  }
}

export function ColorToCSS(color: Color){
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`
}

export function ResizeBounds(
  bounds: XYWH, 
  corner: Side,
  point: Point
): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
  }

  if((corner & Side.Left) ===Side.Left){
    result.x = Math.min(point.x, bounds.x + bounds.width);

    result.width = Math.abs(bounds.x + bounds.width - point.x)
  }

  if((corner & Side.Right) === Side.Right){
    result.x = Math.min(point.x, bounds.x);

    result.width = Math.abs(point.x - bounds.x);
  }

  if((corner & Side.Top) === Side.Top){
    result.y = Math.min(point.y, bounds.y + bounds.height);

    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if((corner & Side.Bottom) === Side.Bottom){
    result.y = Math.min(point.y, bounds.y);

    result.height = Math.abs(point.y - bounds.y)

  }

  return result;
}

export function findIntersectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point
){
    const rect = {
      x: Math.min(a.x, b.x),
      y: Math.min(a.y, b.y),
      width: Math.abs(a.x - b.x),
      height: Math.abs(a.y - b.y)
    }

    const ids = [];

    for(const layerId of layerIds){
      const layer = layers.get(layerId);

      if(layer == null){
        continue;
      }

      const { x, y, width, height } = layer;

      if(
        rect.x + rect.width  > x &&
        rect.x < x + width &&
        rect.y + rect.height > y &&
        rect.y < y + height
      ){
        ids.push(layerId);
      }
    }

    return ids;
}

export function getContrastingTextColor (color: Color) {
  const luminense = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  return luminense > 0.179 ? '#000000' : '#FFFFFF';
}