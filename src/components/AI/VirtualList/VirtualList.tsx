import type React from "react";
import { useState, useMemo } from "react";
import type { VirtualListProps } from "./types";

/**
 * 
外层div：overflow-hidden，containerHeight
中层div：height 是所有 item 的总高度，用来撑开滚动条，position：relative
内层div：position：absolute 绝对定位脱离标准文档流，transform：translateY 用来偏移

首先计算 totalHeight = items.length * itemHeight，然后赋值给中层 div 的 height 属性
然后去确定到底要截取 items 数组的哪一部分渲染，即先确定 visibleCount，再确定 start 和 end，然后再 items.slice(start, end):

visibleCount：等于外层 div 的 containerHeight 除以 itemHeight，这里 ceil 向上取整是为了渲染完整（比如 100px / 30px = 3.3） 
但是应该将第四个 item 也渲染出来，即 ceil（3.3）= 4

start：等于外层 div 的 scrollTop 属性（代表中层 div 向下滚动后超出外层 div 的部分）除以 itemHeight
这里应该 floor 向下取整（比如 100px / 30px = 3.3 ，相当于前面三个不渲染，而第四个还未完全滚动出去所有应该继续渲染）

end：等于 Math.min(start + visibleCount + 1, items.length - 1)，之所以比较是因为不能让 end 索引超出列表
start + visibleCount + 1 是为了预渲染优化效果

然后就可以从 items 截取出渲染列表项并开始循环渲染，当发生滚动时，通过给外层 div 注册 onScroll 事件更新 scrollTop state，
重新计算 start 和 end 及其对应的渲染列表项，并且计算 offsetY = start * itemHeight 使得内层 div 开始偏移，展示正确的位置

为什么需要 translateY? 没有 translateY，当中层 div 被滚动上去了后，内层列表div也会跟着一起滚动上去（因为中层div 设置了相对定位），
需要通过 translateY 让内层 div 位移下来与外层 div 重合
 */
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
  const visibleItems = items.slice(visibleRange.start, visibleRange.end + 1);

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
