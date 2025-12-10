import React, { useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  CircularProgress,
  Alert,
} from '@mui/material';
import { messagingService, Conversation } from '../services/messagingService';
import { useMessagingStore } from '../store/messagingStore';
import { useAuthStore } from '../store/authStore';

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({ onSelectConversation }) => {
  const { user } = useAuthStore();
  const { conversations, currentConversation, loading, error, setConversations, setLoading, setError } =
    useMessagingStore();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getConversations();
      setConversations(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (conversations.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          No conversations yet
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Start a conversation from a property listing
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
      {conversations.map((conversation) => {
        const isSelected = currentConversation?.id === conversation.id;
        const unreadCount = conversation.unreadCount[user?.uid || ''] || 0;
        const otherUser = conversation.otherParticipant;

        return (
          <ListItem key={conversation.id} disablePadding>
            <ListItemButton
              selected={isSelected}
              onClick={() => onSelectConversation(conversation)}
              sx={{
                borderLeft: isSelected ? 3 : 0,
                borderColor: 'primary.main',
              }}
            >
              <ListItemAvatar>
                <Badge badgeContent={unreadCount} color="error">
                  <Avatar src={otherUser?.photoURL} alt={otherUser?.name}>
                    {otherUser?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography
                      variant="subtitle2"
                      fontWeight={unreadCount > 0 ? 600 : 400}
                      noWrap
                    >
                      {otherUser?.name || 'Unknown User'}
                    </Typography>
                    {conversation.lastMessage && (
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(conversation.lastMessage.timestamp)}
                      </Typography>
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    {conversation.property && (
                      <Typography variant="caption" color="primary" display="block" noWrap>
                        {conversation.property.title}
                      </Typography>
                    )}
                    {conversation.lastMessage && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        fontWeight={unreadCount > 0 ? 500 : 400}
                      >
                        {conversation.lastMessage.senderId === user?.uid ? 'You: ' : ''}
                        {conversation.lastMessage.text}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
