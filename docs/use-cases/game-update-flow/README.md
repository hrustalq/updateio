# Game Update Flow

## Overview
This document describes the main use case of the game update flow in our system, from detecting updates to applying them on client machines.

## Flow Description

1. **Update Detection (Discord Bot)**
   - Discord bot monitors game-specific channels for update announcements
   - When an update is detected, bot creates a message in Kafka queue
   - Message contains: game name, update content, timestamp

2. **Update Processing (API)**
   - API service subscribes to the Kafka queue for new updates
   - Upon receiving update message:
     - Resolves game name to specific game IDs (handles multiple games with same name)
     - Creates new enriched message in Kafka
     - Enriched message contains: update content, list of consumers, game IDs

3. **User Notification (Telegram Bot)**
   - Telegram bot subscribes to the enriched update queue
   - For each consumer:
     - Sends notification message with update details
     - Includes interactive "Update" button
   - Notification can be sent to:
     - Private chats
     - Group chats

4. **Update Initiation**
   - User receives notification and presses "Update" button
   - Action triggers webhook in Telegram bot
   - Telegram bot creates new message in Kafka queue with:
     - Game IDs
     - Update instructions
     - Consumer machine ID

5. **Update Execution (Client Desktop)**
   - Client desktop application subscribes to update execution queue
   - Upon receiving update message, begins update process
   - Reports progress through multiple stages:
     1. Update Started
        - Initial acknowledgment
        - Resource preparation
     2. Update Processing
        - Download progress
        - Installation progress
     3. Update Finished
        - Success scenario
          - Verification complete
          - Game ready to play
        - Error scenario
          - Error details
          - Troubleshooting information

6. **Status Reporting**
   - Client receives status messages for each step of the process
   - Status updates are displayed in the Telegram chat
   - Allows for real-time monitoring of update progress

## Technical Components

- **Message Brokers**:
  - Kafka for reliable message queuing
  - Multiple topics for different stages of the process

- **Services**:
  - Discord Bot (Update Detection)
  - API Service (Update Processing)
  - Telegram Bot (User Interaction)
  - Client Desktop App (Update Execution)

- **Communication**:
  - Webhook-based interactions
  - Event-driven architecture
  - Real-time status updates

## Error Handling

- Failed game ID resolution
- Network connectivity issues
- Update installation failures
- Client machine offline scenarios 