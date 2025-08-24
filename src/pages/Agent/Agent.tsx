import { Card } from "antd";
import type { Agent } from "../../types";

const mockAgents: Agent[] = [
  {
    name: "今日食谱Agent",
    description: "告诉用户今天该吃什么以及菜肴制作方法的Agent",
  },
  {
    name: "音乐Agent",
    description: "记录用户喜欢听的音乐并可以播放的Agent",
  },
  {
    name: "今日食谱Agent",
    description: "告诉用户今天该吃什么以及菜肴制作方法的Agent",
  },
  {
    name: "音乐Agent",
    description: "记录用户喜欢听的音乐并可以播放的Agent",
  },
  {
    name: "今日食谱Agent",
    description: "告诉用户今天该吃什么以及菜肴制作方法的Agent",
  },
  {
    name: "音乐Agent",
    description: "记录用户喜欢听的音乐并可以播放的Agent",
  },
  {
    name: "今日食谱Agent",
    description: "告诉用户今天该吃什么以及菜肴制作方法的Agent",
  },
  {
    name: "音乐Agent",
    description: "记录用户喜欢听的音乐并可以播放的Agent",
  },
];

const Agent = () => {
  return (
    <div className="p-4 flex gap-3 flex-wrap">
      {mockAgents.map((agent) => (
        <Card
          title={agent.name}
          hoverable
          className="w-60"
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          styles={{
            title: {
              display: "flex",
              justifyContent: "center",
            },
          }}
        >
          <p>{agent.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default Agent;
