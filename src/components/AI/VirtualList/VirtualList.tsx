import type React from "react";
import { useState, useMemo } from "react";
import type { VirtualListProps } from "./types";

const VirtualList = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = "",
}: VirtualListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  // 计算可见区域的范围
  const visibleRange = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + visibleCount + 1, items.length - 1);
    return {
      start: Math.max(0, start),
      end: Math.max(0, end),
      visibleCount,
    };
  }, [scrollTop, containerHeight, itemHeight, items.length]);
  // 计算总高度
  const totalHeight = items.length * itemHeight;
  // 计算可见元素
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange.start, visibleRange.end]);
  // 处理滚动事件
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };
  // 计算偏移量
  const offsetY = visibleRange.start * itemHeight;
  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* 总容器，用于撑开滚动条 */}
      <div style={{ height: totalHeight, position: "relative" }}>
        {/* 可见元素容器 */}
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualList;
