# Database Schema Design

## Overview
This document outlines the database schema for the music streaming application. The actual database implementation will be done in future phases.

## Planned Tables

### Users
- User authentication and profile information
- Preferences and settings
- Subscription details

### Songs
- Song metadata (title, artist, album, duration)
- Audio file references
- Genre and tags

### Playlists
- User-created playlists
- Playlist metadata
- Song associations

### Artists
- Artist information
- Discography
- Biography

### Albums
- Album metadata
- Track listings
- Release information

### Listening History
- User listening patterns
- Play counts
- Timestamps

## Relationships
- Users → Playlists (One-to-Many)
- Playlists → Songs (Many-to-Many)
- Artists → Songs (One-to-Many)
- Albums → Songs (One-to-Many)
- Users → Listening History (One-to-Many)

## Notes
- Schema will be implemented in Phase-2 or later
- Database choice: PostgreSQL or MongoDB (TBD)
- Indexing strategy to be defined based on query patterns
