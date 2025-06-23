import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPanel = ({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-16 right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
        <div className="p-2 flex justify-between items-center text-sm">
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="text-primary hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            Mark all as read
          </button>
          <button
            onClick={onClearAll}
            className="text-red-500 hover:underline"
          >
            Clear all
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="ri-notification-off-line text-4xl mb-2"></i>
              <p>No new notifications</p>
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`border-b border-gray-100 p-4 ${
                    notification.read ? 'bg-white' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.read ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white'}`}>
                        <i className="ri-chat-1-line"></i>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{notification.message}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="p-1 rounded-full hover:bg-gray-200"
                        title="Mark as read"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPanel; 