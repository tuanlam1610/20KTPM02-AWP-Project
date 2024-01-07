import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Badge, Popover, notification } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useAppSelector } from '../../redux/store';
import { queryClient } from '../../App';
import dayjs from 'dayjs';

export default function NotificationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const getNotification = async () => {
    const notifications = await axios.get(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/notifications/user/${
        userInfo?.id
      }`,
    );
    const unreadNotification = await axios.get(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/notifications/unread/user/${
        userInfo?.id
      }`,
    );

    return {
      notificationList: notifications.data as [],
      unreadCount: unreadNotification.data.length,
    };
  };
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notification'],
    queryFn: getNotification,
    refetchInterval: 10000,
  });

  return (
    <Popover
      placement="bottom"
      content={
        data ? (
          <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
            {data.notificationList.length <= 0 ? (
              <div className="text-center">There is no notifications</div>
            ) : (
              <div className="flex justify-end">
                <span
                  onClick={async () => {
                    const res = await axios.patch(
                      `${
                        import.meta.env.VITE_REACT_APP_SERVER_URL
                      }/notifications/unread/user/${userInfo?.id}`,
                    );
                    refetch();
                  }}
                  className="hover:text-indigo-500 hover:underline cursor-pointer"
                >
                  Mark all as read
                </span>
              </div>
            )}
            {data.notificationList.map((notification) => {
              return <NotificationItem notification={notification} />;
            })}
          </div>
        ) : (
          <>Loading...</>
        )
      }
      arrow={false}
      trigger="click"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div onClick={() => setIsOpen(!isOpen)}>
        <Badge
          className={`cursor-pointer p-1 rounded-full hover:bg-indigo-500 hover:text-white ${
            isOpen && 'bg-indigo-500 text-white'
          }`}
          size="small"
          count={data && data.unreadCount}
          overflowCount={9}
        >
          <BellOutlined
            style={{
              fontSize: '20px',
            }}
          />
        </Badge>
      </div>
    </Popover>
  );
}

const NotificationItem = ({ notification }: { notification: any }) => {
  return (
    <div
      onClick={async () => {
        if (!notification.isRead) {
          await axios.patch(
            `${import.meta.env.VITE_REACT_APP_SERVER_URL}/notifications/${
              notification.id
            }`,
            { isRead: true },
          );
          await queryClient.refetchQueries({
            queryKey: ['notification'],
            type: 'active',
          });
        }
      }}
      className="flex gap-4 items-center cursor-pointer hover:bg-slate-100 p-2 rounded"
    >
      <Avatar icon={<UserOutlined />} className="bg-indigo-500 aspect-square" />
      <div className="w-[240px]">
        <div className="line-clamp-3 text-justify">{notification.content}</div>
        <div className="text-xs flex justify-end">
          {dayjs(notification.createdAt).fromNow()}
        </div>
      </div>
      {!notification.isRead && (
        <div className="bg-indigo-500 w-3 aspect-square rounded-full"></div>
      )}
    </div>
  );
};
