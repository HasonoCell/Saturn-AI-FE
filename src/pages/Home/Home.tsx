import { MessageBubble, MessageSender } from "../../components";

const Home = () => {
  return (
    <div className="px-10 py-4 h-full flex flex-col items-center">
      <MessageBubble />
      <MessageSender />
    </div>
  );
};

export default Home;
