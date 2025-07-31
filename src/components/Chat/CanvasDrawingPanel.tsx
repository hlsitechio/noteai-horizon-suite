import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, Triangle, Path, FabricText } from "fabric";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Palette,
  PenTool,
  Square,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Type,
  Eraser,
  RotateCcw,
  Save,
  Download,
  Upload,
  Move,
  MousePointer,
  Maximize2,
  Minimize2,
  CornerDownRight,
  Layers,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface CanvasDrawingPanelProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  className?: string;
}

type Tool = 'select' | 'pen' | 'rectangle' | 'circle' | 'triangle' | 'text' | 'eraser';

export const CanvasDrawingPanel: React.FC<CanvasDrawingPanelProps> = ({
  isVisible,
  onToggleVisibility,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState([3]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const [layers, setLayers] = useState<Array<{ id: number; name: string; visible: boolean }>>([]);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current || !isVisible) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: '#ffffff',
      selection: activeTool === 'select',
    });

    // Configure drawing brush
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = brushWidth[0];
    canvas.isDrawingMode = activeTool === 'pen';

    setFabricCanvas(canvas);

    // Event listeners for layers management
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);

    return () => {
      canvas.dispose();
    };
  }, [isVisible, canvasSize]);

  // Update canvas settings when tool changes
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'pen';
    fabricCanvas.selection = activeTool === 'select';
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = brushColor;
      fabricCanvas.freeDrawingBrush.width = brushWidth[0];
    }
  }, [activeTool, brushColor, brushWidth, fabricCanvas]);

  const updateLayers = useCallback(() => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects();
    const layerList = objects.map((obj, index) => ({
      id: index,
      type: obj.type,
      visible: obj.visible !== false,
      name: `${obj.type} ${index + 1}`
    }));
    setLayers(layerList);
  }, [fabricCanvas]);

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);

    if (!fabricCanvas) return;

    if (tool === 'rectangle') {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: brushColor,
        width: 100,
        height: 100,
        stroke: brushColor,
        strokeWidth: 2,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: 'transparent',
        radius: 50,
        stroke: brushColor,
        strokeWidth: brushWidth[0],
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    } else if (tool === 'triangle') {
      const triangle = new Triangle({
        left: 100,
        top: 100,
        fill: 'transparent',
        width: 100,
        height: 100,
        stroke: brushColor,
        strokeWidth: brushWidth[0],
      });
      fabricCanvas.add(triangle);
      fabricCanvas.setActiveObject(triangle);
    } else if (tool === 'text') {
      const text = new FabricText('Double click to edit', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: 20,
        fill: brushColor,
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    toast({
      title: "Canvas cleared!",
      description: "All drawing content has been removed.",
    });
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    
    // Save to localStorage for now
    localStorage.setItem('canvas-drawing', dataURL);
    toast({
      title: "Canvas saved!",
      description: "Your drawing has been saved locally.",
    });
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    
    const link = document.createElement('a');
    link.download = `canvas-drawing-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast({
      title: "Download started!",
      description: "Your canvas drawing is being downloaded.",
    });
  };

  const handleResize = (newWidth: number, newHeight: number) => {
    if (!fabricCanvas) return;
    
    fabricCanvas.setWidth(newWidth);
    fabricCanvas.setHeight(newHeight);
    setCanvasSize({ width: newWidth, height: newHeight });
    fabricCanvas.renderAll();
  };

  const toggleLayerVisibility = (layerIndex: number) => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects();
    const obj = objects[layerIndex];
    if (obj) {
      obj.visible = !obj.visible;
      fabricCanvas.renderAll();
      updateLayers();
    }
  };

  const deleteLayer = (layerIndex: number) => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects();
    const obj = objects[layerIndex];
    if (obj) {
      fabricCanvas.remove(obj);
      updateLayers();
    }
  };

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
  ];

  if (!isVisible) {
    return (
      <div className={`${className} border-l border-border/30 bg-gradient-to-br from-background via-muted/5 to-primary/5 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="relative p-8 h-full flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 via-accent/15 to-primary/25 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/30 shadow-2xl">
                <Palette className="w-10 h-10 text-primary drop-shadow-lg" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"></div>
            </div>
            <Button
              variant="outline"
              onClick={onToggleVisibility}
              className="group h-14 px-8 rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-background/80 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all duration-500 shadow-2xl hover:shadow-primary/20 backdrop-blur-sm"
            >
              <Palette className="w-6 h-6 text-primary mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-lg bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Show Canvas</span>
            </Button>
            <p className="text-sm text-muted-foreground/80 font-medium max-w-48 leading-relaxed">
              Open the interactive drawing workspace
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} border-l border-border/30 bg-gradient-to-br from-background via-primary/5 to-accent/5 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-60"></div>
      
      <div className="relative h-full flex flex-col backdrop-blur-sm">
        {/* Enhanced Header */}
        <div className="p-4 border-b border-border/30 bg-gradient-to-r from-primary/10 via-accent/8 to-primary/10 backdrop-blur-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Drawing Canvas
                </h3>
                <p className="text-xs text-muted-foreground">
                  Interactive drawing workspace
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0 rounded-lg hover:bg-muted/50"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
                className="h-8 w-8 p-0 rounded-lg hover:bg-muted/50"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tools Panel */}
        <div className="p-3 border-b border-border/30 bg-muted/20">
          <div className="space-y-3">
            {/* Drawing Tools */}
            <div className="flex flex-wrap gap-2">
              {[
                { tool: 'select', icon: MousePointer, label: 'Select' },
                { tool: 'pen', icon: PenTool, label: 'Pen' },
                { tool: 'rectangle', icon: Square, label: 'Rectangle' },
                { tool: 'circle', icon: CircleIcon, label: 'Circle' },
                { tool: 'triangle', icon: TriangleIcon, label: 'Triangle' },
                { tool: 'text', icon: Type, label: 'Text' },
              ].map(({ tool, icon: Icon, label }) => (
                <Button
                  key={tool}
                  variant={activeTool === tool ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolClick(tool as Tool)}
                  className="h-8 w-8 p-0 rounded-lg transition-all duration-200"
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            {/* Color Palette */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Color</div>
              <div className="flex flex-wrap gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrushColor(color)}
                    className={`w-6 h-6 rounded-md border-2 transition-all duration-200 ${
                      brushColor === color ? 'border-primary scale-110' : 'border-border hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <input
                  id="custom-color-picker"
                  name="customColor"
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-6 h-6 rounded-md border-2 border-border cursor-pointer"
                  title="Custom color"
                />
              </div>
            </div>

            {/* Brush Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Size</span>
                <Badge variant="secondary" className="text-xs">{brushWidth[0]}px</Badge>
              </div>
              <Slider
                value={brushWidth}
                onValueChange={setBrushWidth}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Canvas Size Controls */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Canvas Size</div>
              <div className="flex gap-2">
                <Input
                  id="canvas-width"
                  name="canvasWidth"
                  type="number"
                  value={canvasSize.width}
                  onChange={(e) => handleResize(Number(e.target.value), canvasSize.height)}
                  className="h-8 text-xs"
                  min="100"
                  max="2000"
                />
                <span className="text-xs text-muted-foreground self-center">×</span>
                <Input
                  id="canvas-height"
                  name="canvasHeight"
                  type="number"
                  value={canvasSize.height}
                  onChange={(e) => handleResize(canvasSize.width, Number(e.target.value))}
                  className="h-8 text-xs"
                  min="100"
                  max="2000"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="h-8 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="h-8 text-xs"
              >
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-4 overflow-auto">
            <div 
              className="border border-border/50 rounded-lg shadow-lg overflow-hidden bg-white"
              style={{ width: 'fit-content', height: 'fit-content' }}
            >
              <canvas ref={canvasRef} className="block" />
            </div>
          </div>

          {/* Layers Panel */}
          <div className="w-48 border-l border-border/30 bg-muted/10 p-3 overflow-auto">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Layers</span>
              </div>
              
              <div className="space-y-1">
                {layers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 ${
                      selectedLayer === index 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-background border-border/50 hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedLayer(index)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerVisibility(index);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      {layer.visible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-muted-foreground" />
                      )}
                    </Button>
                    <span className="text-xs flex-1 truncate">{layer.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(index);
                      }}
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                
                {layers.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No layers yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};