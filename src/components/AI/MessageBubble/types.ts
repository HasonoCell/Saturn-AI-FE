import type { GetProp, GetRef } from "antd";
import { Bubble, type BubbleProps } from "@ant-design/x";

export type BubbleListRef = GetRef<typeof Bubble.List>;
export type BubbleListRoles = GetProp<typeof Bubble.List, "roles">;
export type MarkdownRender = BubbleProps["messageRender"];
