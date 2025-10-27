'use client';
import { useState, useEffect, Children, cloneElement, isValidElement } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

const getFromLS = (key: string) => {
  let ls: { [key: string]: any } = {};
  if (global.localStorage) {
    try {
      const storedData = localStorage.getItem('dashboard-layout');
      if (storedData) {
        ls = JSON.parse(storedData) || {};
      }
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
};

const saveToLS = (key: string, value: any) => {
  if (global.localStorage) {
    localStorage.setItem(
      'dashboard-layout',
      JSON.stringify({
        [key]: value,
      })
    );
  }
};

const defaultLayouts = {
    lg: [
        { i: 'pet', x: 0, y: 0, w: 8, h: 4, minH: 4, minW: 4 },
        { i: 'dailyGoal', x: 8, y: 0, w: 4, h: 1, minH: 1, minW: 2 },
        { i: 'xpGained', x: 8, y: 1, w: 4, h: 1, minH: 1, minW: 2 },
        { i: 'petIntro', x: 8, y: 2, w: 4, h: 2, minH: 2, minW: 3 },
        { i: 'tasks', x: 0, y: 4, w: 12, h: 3, minH: 3, minW: 6 },
    ],
    md: [
        { i: 'pet', x: 0, y: 0, w: 6, h: 4 },
        { i: 'dailyGoal', x: 6, y: 0, w: 4, h: 1 },
        { i: 'xpGained', x: 6, y: 1, w: 4, h: 1 },
        { i: 'petIntro', x: 0, y: 4, w: 6, h: 2 },
        { i: 'tasks', x: 0, y: 6, w: 10, h: 3 },
    ],
    sm: [
        { i: 'pet', x: 0, y: 0, w: 6, h: 4 },
        { i: 'dailyGoal', x: 0, y: 4, w: 3, h: 1 },
        { i: 'xpGained', x: 3, y: 4, w: 3, h: 1 },
        { i: 'petIntro', x: 0, y: 5, w: 6, h: 2 },
        { i: 'tasks', x: 0, y: 7, w: 6, h: 3 },
    ],
    xs: [
        { i: 'pet', x: 0, y: 0, w: 4, h: 4 },
        { i: 'dailyGoal', x: 0, y: 4, w: 4, h: 1 },
        { i: 'xpGained', x: 0, y: 5, w: 4, h: 1 },
        { i: 'petIntro', x: 0, y: 6, w: 4, h: 2 },
        { i: 'tasks', x: 0, y: 8, w: 4, h: 3 },
    ],
    xxs: [
        { i: 'pet', x: 0, y: 0, w: 2, h: 4 },
        { i: 'dailyGoal', x: 0, y: 4, w: 2, h: 1 },
        { i: 'xpGained', x: 0, y: 5, w: 2, h: 1 },
        { i: 'petIntro', x: 0, y: 6, w: 2, h: 2 },
        { i: 'tasks', x: 0, y: 8, w: 2, h: 3 },
    ],
};


const DashboardGridLayout = ({ children, isEditing }: { children: React.ReactNode, isEditing: boolean }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [layouts, setLayouts] = useState<{[key: string]: Layout[]}>(() => getFromLS('layouts') || defaultLayouts);

  useEffect(() => {
    setIsMounted(true);
    // Set layouts from LS on mount
    const savedLayouts = getFromLS('layouts');
    if (savedLayouts) {
        setLayouts(savedLayouts);
    } else {
        setLayouts(defaultLayouts);
    }
  }, []);
  
  const onLayoutChange = (layout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    saveToLS('layouts', allLayouts);
    setLayouts(allLayouts);
  };

  if (!isMounted) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
             {Children.map(children, child => {
                if (isValidElement(child)) {
                    // This renders a static version for SSR to prevent layout shifts
                    return <div className="h-full">{child}</div>;
                }
                return null;
            })}
        </div>
    );
  }
  
  return (
    <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
        isDraggable={isEditing}
        isResizable={isEditing}
        draggableHandle=".react-grid-drag-handle"
    >
        {children}
    </ResponsiveGridLayout>
  );
};

export default DashboardGridLayout;
