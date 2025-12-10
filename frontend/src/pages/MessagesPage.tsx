import React, { useState } from 'react';
import { Box, Grid, Paper, useMediaQuery, useTheme, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import { Conversation } from '../services/messagingService';
import { useMessagingStore } from '../store/messagingStore';

export const MessagesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showChat, setShowChat] = useState(false);
  const { setCurrentConversation } = useMessagingStore();

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBackToList = () => {
    setShowChat(false);
    setCurrentConversation(null);
  };

  if (isMobile) {
    return (
      <Box sx={{ height: 'calc(100vh - 64px)' }}>
        {!showChat ? (
          <Paper sx={{ height: '100%', overflow: 'auto' }}>
            <ConversationList onSelectConversation={handleSelectConversation} />
          </Paper>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
              <IconButton onClick={handleBackToList}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
            <Box sx={{ flex: 1 }}>
              <ChatWindow />
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', p: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Paper sx={{ height: '100%', overflow: 'auto' }}>
            <ConversationList onSelectConversation={handleSelectConversation} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <Paper sx={{ height: '100%' }}>
            <ChatWindow />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
