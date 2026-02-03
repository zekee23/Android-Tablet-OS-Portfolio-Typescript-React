import { useState, useRef, useEffect, useCallback } from 'react';

export function useDragPanel(initialHeight: number = 600) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [panelHeight, setPanelHeight] = useState(initialHeight);
  const startY = useRef(0);
  const initialDragOffset = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input[type="range"]')) {
      return;
    }
    e.preventDefault();
    startY.current = e.clientY;
    initialDragOffset.current = dragOffset;
    setIsDragging(true);
  }, [dragOffset]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const currentY = e.clientY;
    const deltaY = currentY - startY.current;
    let newOffset = initialDragOffset.current + deltaY;
    newOffset = Math.max(0, Math.min(panelHeight, newOffset));
    setDragOffset(newOffset);
  }, [isDragging, panelHeight]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = panelHeight / 2;
    if (dragOffset > threshold) {
      setDragOffset(panelHeight);
    } else {
      setDragOffset(0);
    }
  }, [isDragging, dragOffset, panelHeight]);

  // Touch event handlers
  useEffect(() => {
    const panel = panelRef.current;
    const statusBar = statusBarRef.current;
    
    if (!panel || !statusBar) return;

    const handleTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('button, input[type="range"]')) {
        return;
      }
      e.preventDefault();
      const touch = e.touches[0];
      startY.current = touch.clientY;
      initialDragOffset.current = dragOffset;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const deltaY = currentY - startY.current;
      let newOffset = initialDragOffset.current + deltaY;
      newOffset = Math.max(0, Math.min(panelHeight, newOffset));
      setDragOffset(newOffset);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setIsDragging(false);
      const threshold = panelHeight / 2;
      if (dragOffset > threshold) {
        setDragOffset(panelHeight);
      } else {
        setDragOffset(0);
      }
    };

    panel.addEventListener('touchstart', handleTouchStart, { passive: false });
    panel.addEventListener('touchmove', handleTouchMove, { passive: false });
    panel.addEventListener('touchend', handleTouchEnd, { passive: false });
    statusBar.addEventListener('touchstart', handleTouchStart, { passive: false });
    statusBar.addEventListener('touchmove', handleTouchMove, { passive: false });
    statusBar.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      panel.removeEventListener('touchstart', handleTouchStart);
      panel.removeEventListener('touchmove', handleTouchMove);
      panel.removeEventListener('touchend', handleTouchEnd);
      statusBar.removeEventListener('touchstart', handleTouchStart);
      statusBar.removeEventListener('touchmove', handleTouchMove);
      statusBar.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragOffset, isDragging, panelHeight]);

  useEffect(() => {
    if (isDragging) {
      const handleMove = (e: MouseEvent) => handleMouseMove(e);
      const handleUp = () => handleMouseUp();
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      return () => {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const updatePanelHeight = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobile = screenWidth < 640;
      const isPortrait = screenHeight > screenWidth;
      let maxHeight: number;
      
      if (isMobile && isPortrait) {
        // For small portrait screens, extend to just before the nav bar
        // Assuming nav bar height is around 60-70px, leave some padding
        const navBarHeight = 70;
        const statusBarHeight = 40; // Status bar at top
        const bottomPadding = 20; // Small padding before nav bar
        maxHeight = screenHeight - statusBarHeight - navBarHeight - bottomPadding;
      } else if (isMobile) {
        // For mobile landscape or larger screens
        if (screenHeight >= 730) {
          maxHeight = Math.min(screenHeight * 0.92, 800);
        } else {
          maxHeight = Math.min(screenHeight * 0.85, 700);
        }
      } else {
        // For desktop/tablet
        maxHeight = Math.min(600, screenHeight * 0.8);
      }
      setPanelHeight(maxHeight);
    };

    updatePanelHeight();
    window.addEventListener('resize', updatePanelHeight);
    return () => window.removeEventListener('resize', updatePanelHeight);
  }, []);

  return {
    dragOffset,
    setDragOffset,
    isDragging,
    panelHeight,
    panelRef,
    statusBarRef,
    handleMouseDown
  };
}
