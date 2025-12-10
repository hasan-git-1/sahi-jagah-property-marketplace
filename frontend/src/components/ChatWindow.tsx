import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { messagingService, Message } from '../services/messagingService';
import { useMessagingStore } from '../store/messagingStore';
import { useAuthStore } from '../store/authStore';

export const ChatWindow: React.FC = () => {
  const { user } = useAuthStore();
  const { currentConversation, messages, setMessages, addMessage } = useMessagingStore();
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentConversation) {
      loadMessages();
      markAsRead();

      // Subscribe to real-time updates
      const unsubscribe = messagingService.subscribeToMessages(
        currentConversation.id,
        (newMessages) => {
          setMessages(newMessages);
          scrollToBottom();
        }
      );

      return () => unsubscribe();
    }
  }, [currentConversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!currentConversation) return;

    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getMessages(currentConversation.id);
      setMessages(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (!currentConversation) return;

    try {
      await messagingService.markAsRead(currentConversation.id);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentConversation || (!messageText.trim() && attachments.length === 0)) return;

    try {
      setSending(true);
      const message = await messagingService.sendMessage(
        currentConversation.id,
        messageText,
        attachments
      );
      addMessage(message);
      setMessageText('');
      setAttachments([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    setAttachments((prev) => [...prev, ...imageFiles].slice(0, 5));
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (!currentConversation) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        bgcolor="grey.50"
      >
        <Typography variant="body1" color="text.secondary">
          Select a conversation to start messaging
        </Typography>
      </Box>
    );
  }

  const otherUser = currentConversation.otherParticipant;

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderRadius: 0,
        }}
      >
        <Avatar src={otherUser?.photoURL} alt={otherUser?.name}>
          {otherUser?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box flex={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            {otherUser?.name || 'Unknown User'}
          </Typography>
          {currentConversation.property && (
            <Typography variant="caption" color="text.secondary">
              About: {currentConversation.property.title}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Messages */}
      <Box
        flex={1}
        overflow="auto"
        p={2}
        bgcolor="grey.50"
        sx={{
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.400', borderRadius: '4px' },
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : messages.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="body2" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === user?.uid;
            return (
              <Box
                key={message.id}
                display="flex"
                justifyContent={isOwn ? 'flex-end' : 'flex-start'}
                mb={2}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    bgcolor: isOwn ? 'primary.main' : 'white',
                    color: isOwn ? 'white' : 'text.primary',
                  }}
                >
                  {message.attachments && message.attachments.length > 0 && (
                    <ImageList cols={message.attachments.length > 1 ? 2 : 1} gap={8} sx={{ mb: 1 }}>
                      {message.attachments.map((attachment, idx) => (
                        <ImageListItem key={idx}>
                          <img
                            src={attachment.thumbnailUrl || attachment.url}
                            alt="Attachment"
                            loading="lazy"
                            style={{ borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => window.open(attachment.url, '_blank')}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  )}
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {message.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      opacity: 0.8,
                      textAlign: 'right',
                    }}
                  >
                    {formatTime(message.createdAt)}
                  </Typography>
                </Paper>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 0 }}>
        {attachments.length > 0 && (
          <Box display="flex" gap={1} mb={1} flexWrap="wrap">
            {attachments.map((file, idx) => (
              <Box key={idx} position="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'background.paper',
                  }}
                  onClick={() => removeAttachment(idx)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
        <Box display="flex" gap={1}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileSelect}
          />
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            disabled={sending || attachments.length >= 5}
          >
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={sending || (!messageText.trim() && attachments.length === 0)}
          >
            {sending ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};
