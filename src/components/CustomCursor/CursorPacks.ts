
export interface CursorPackItem {
  id: string;
  name: string;
  url: string;
  hotspotX?: number;
  hotspotY?: number;
}

export interface CursorPack {
  id: string;
  name: string;
  description: string;
  cursors: {
    default: CursorPackItem;
    pointer: CursorPackItem;
    text: CursorPackItem;
    grab: CursorPackItem;
    grabbing: CursorPackItem;
    crosshair: CursorPackItem;
    move: CursorPackItem;
    resize: CursorPackItem;
    loading: CursorPackItem;
  };
}

export const cursorPacks: CursorPack[] = [
  {
    id: 'default',
    name: 'Default System',
    description: 'Standard browser cursors',
    cursors: {
      default: { id: 'default-default', name: 'Default', url: '', hotspotX: 0, hotspotY: 0 },
      pointer: { id: 'default-pointer', name: 'Pointer', url: '', hotspotX: 0, hotspotY: 0 },
      text: { id: 'default-text', name: 'Text', url: '', hotspotX: 0, hotspotY: 0 },
      grab: { id: 'default-grab', name: 'Grab', url: '', hotspotX: 0, hotspotY: 0 },
      grabbing: { id: 'default-grabbing', name: 'Grabbing', url: '', hotspotX: 0, hotspotY: 0 },
      crosshair: { id: 'default-crosshair', name: 'Crosshair', url: '', hotspotX: 0, hotspotY: 0 },
      move: { id: 'default-move', name: 'Move', url: '', hotspotX: 0, hotspotY: 0 },
      resize: { id: 'default-resize', name: 'Resize', url: '', hotspotX: 0, hotspotY: 0 },
      loading: { id: 'default-loading', name: 'Loading', url: '', hotspotX: 0, hotspotY: 0 },
    }
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Bright neon cursors with glow effects',
    cursors: {
      default: { id: 'neon-default', name: 'Neon Default', url: '/cursors/cursor-default.png', hotspotX: 16, hotspotY: 16 },
      pointer: { id: 'neon-pointer', name: 'Neon Pointer', url: '/cursors/cursor-pointer.png', hotspotX: 16, hotspotY: 16 },
      text: { id: 'neon-text', name: 'Neon Text', url: '/cursors/cursor-default.png', hotspotX: 16, hotspotY: 16 },
      grab: { id: 'neon-grab', name: 'Neon Grab', url: '/cursors/cursor-grab.png', hotspotX: 16, hotspotY: 16 },
      grabbing: { id: 'neon-grabbing', name: 'Neon Grabbing', url: '/cursors/cursor-grab.png', hotspotX: 16, hotspotY: 16 },
      crosshair: { id: 'neon-crosshair', name: 'Neon Crosshair', url: '/cursors/cursor-default.png', hotspotX: 16, hotspotY: 16 },
      move: { id: 'neon-move', name: 'Neon Move', url: '/cursors/cursor-pointer.png', hotspotX: 16, hotspotY: 16 },
      resize: { id: 'neon-resize', name: 'Neon Resize', url: '/cursors/cursor-grab.png', hotspotX: 16, hotspotY: 16 },
      loading: { id: 'neon-loading', name: 'Neon Loading', url: '/cursors/cursor-default.png', hotspotX: 16, hotspotY: 16 },
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple cursor design',
    cursors: {
      default: { id: 'minimal-default', name: 'Minimal Default', url: '/cursors/cursor-pointer.png', hotspotX: 16, hotspotY: 16 },
      pointer: { id: 'minimal-pointer', name: 'Minimal Pointer', url: '/cursors/cursor-grab.png', hotspotX: 16, hotspotY: 16 },
      text: { id: 'minimal-text', name: 'Minimal Text', url: '/cursors/cursor-default.png', hotspotX: 16, hotspotY: 16 },
      grab: { id: 'minimal-grab', name: 'Minimal Grab', url: '/cursors/cursor-pointer.png', hotspotX: 16, hotspotY: 16 },
      grabbing: { id: 'minimal-grabbing', name: 'Minimal Grabbing', url: '/cursors/cursor-grab.png', hotspotX: 16, hotspotY: 16 },
      crosshair: { id: 'minimal-crosshair', name: 'Minimal Crosshair', url: '/cursors/cursor-default.png', hotspotX: 16, hotspotY: 16 },
      move: { id: 'minimal-move', name: 'Minimal Move', url: '/cursors/cursor-pointer.png', hotspotX: 16, hotspotY: 16 },
      resize: { id: 'minimal-resize', name: 'Minimal Resize', url: '/cursors/cursor-grab.png', hotspotX: 16, hotspotY: 16 },
      loading: { id: 'minimal-loading', name: 'Minimal Loading', url: '/cursors/cursor-default.png', hotspotX: 16, hotspotY: 16 },
    }
  }
];

export const getCursorPack = (packId: string): CursorPack | undefined => {
  return cursorPacks.find(pack => pack.id === packId);
};
