import React from 'react';
import { Bell, CheckCircle, Clock, X, FileText, DollarSign } from 'lucide-react';

interface Notification {
  id: string;
  type: 'appointment_completed' | 'payment_pending';
  title: string;
  message: string;
  timestamp: string;
  requestId: string;
  practitioner?: {
    name: string;
    photo: string;
    amount?: number;
    reports?: number;
  };
  read: boolean;
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'appointment_completed',
    title: 'Rendez-vous terminé',
    message: 'Dr. Sarah Chen a terminé la consultation',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    requestId: 'MED-2024-001',
    practitioner: {
      name: 'Dr. Sarah Chen',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300'
    },
    read: false
  },
  {
    id: '2',
    type: 'payment_pending',
    title: 'Paiement en attente',
    message: 'Paiement en attente pour 5 rapports médicaux',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    requestId: 'PAY-2024-004',
    practitioner: {
      name: 'Dr. Martin',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
      amount: 800,
      reports: 5
    },
    read: false
  },
  {
    id: '3',
    type: 'appointment_completed',
    title: 'Rendez-vous terminé',
    message: 'Dr. Dubois a terminé la téléconsultation',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    requestId: 'MED-2024-007',
    practitioner: {
      name: 'Dr. Dubois',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300'
    },
    read: true
  }
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) {
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment_completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'payment_pending':
        return <DollarSign className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucune notification
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-4">
                      {notification.practitioner && (
                        <img
                          src={notification.practitioner.photo}
                          alt={notification.practitioner.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-mono text-gray-600">
                              {notification.requestId}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        {notification.type === 'payment_pending' && notification.practitioner?.amount && (
                          <p className="text-sm text-yellow-600 mt-1">
                            Montant en attente : {notification.practitioner.amount}€
                            {notification.practitioner.reports && ` (${notification.practitioner.reports} rapports)`}
                          </p>
                        )}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          <span className="flex items-center space-x-1">
                            {getNotificationIcon(notification.type)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}