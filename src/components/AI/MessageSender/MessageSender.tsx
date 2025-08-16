import { Attachments, Sender } from "@ant-design/x";
import { Button, Badge } from "antd";
import {
  CloudDownloadOutlined,
  LinkOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import type { MessageSenderProps } from "./types";
import { useMessageSender } from "./hooks/useMessageSender";

const MessageSender: React.FC<MessageSenderProps> = ({ isNewConv = false }) => {
  const {
    value,
    isOpen,
    fileList,
    sending,
    uploading,
    currentConv,
    senderRef,
    attachmentsRef,
    setValue,
    setIsOpen,
    setFileList,
    handleMessageSubmit,
    interceptFile,
  } = useMessageSender({ isNewConv });

  return (
    <div className={isNewConv ? "w-full" : "w-2/3"}>
      <Sender
        ref={senderRef}
        loading={sending || uploading}
        value={value}
        onChange={setValue}
        onSubmit={handleMessageSubmit}
        placeholder={isNewConv ? "输入消息开始新对话..." : "输入消息..."}
        disabled={(!isNewConv && !currentConv) || uploading}
        header={
          <Sender.Header
            title="上传附件"
            open={isOpen}
            onOpenChange={setIsOpen}
            forceRender
          >
            <Attachments
              beforeUpload={interceptFile}
              ref={attachmentsRef}
              items={fileList}
              overflow="scrollY"
              onChange={({ fileList }) => setFileList(fileList)}
              placeholder={(type) =>
                type === "drop"
                  ? { title: "请将文件拖拽到此处" }
                  : {
                      title: "请上传文件",
                      icon: <CloudDownloadOutlined />,
                      description: "单击或拖动文件到此区域进行上传",
                    }
              }
              getDropContainer={() => senderRef?.current?.nativeElement}
            />
          </Sender.Header>
        }
        prefix={
          <Badge
            dot={fileList.length > 0 && !isOpen}
            count={fileList.length}
            color="blue"
          >
            <Button
              type="text"
              icon={uploading ? <LoadingOutlined /> : <LinkOutlined />}
              onClick={() => setIsOpen(!isOpen)}
              disabled={uploading}
            />
          </Badge>
        }
      />
    </div>
  );
};

export default MessageSender;
