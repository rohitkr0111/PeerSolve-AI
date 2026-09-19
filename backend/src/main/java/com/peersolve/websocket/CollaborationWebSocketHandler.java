package com.peersolve.websocket;

import java.io.IOException;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class CollaborationWebSocketHandler extends TextWebSocketHandler {

  public record SessionUser(String sessionId, String userId, String name) {}

  private final Map<String, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();
  private final Map<String, SessionUser> sessionUsers = new ConcurrentHashMap<>();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    Map<String, String> queryParams = parseQueryParams(session.getUri());
    String sessionId = queryParams.get("sessionId");
    if (sessionId == null || sessionId.isBlank()) {
      sessionId = queryParams.get("session");
    }
    String userId = queryParams.getOrDefault("userId", "anonymous");
    String name = queryParams.getOrDefault("name", "Peer");

    if (sessionId == null || sessionId.isBlank()) {
      session.close(CloseStatus.BAD_DATA);
      return;
    }

    SessionUser user = new SessionUser(sessionId, userId, name);
    sessionUsers.put(session.getId(), user);

    roomSessions.computeIfAbsent(sessionId, k -> ConcurrentHashMap.newKeySet()).add(session);

    String joinNotice = String.format(
        "{\"type\":\"peer-joined\",\"userId\":\"%s\",\"name\":\"%s\"}",
        escape(userId), escape(name)
    );
    broadcastToRoom(sessionId, session, new TextMessage(joinNotice));
  }

  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    String payload = message.getPayload();

    if (payload.contains("\"type\":\"ping\"") || payload.equals("ping")) {
      synchronized (session) {
        if (session.isOpen()) {
          session.sendMessage(new TextMessage("{\"type\":\"pong\"}"));
        }
      }
      return;
    }

    SessionUser user = sessionUsers.get(session.getId());
    if (user == null) {
      return;
    }

    if (payload.matches("\\{\\\"type\\\":\\\"chat\\\",\\\"text\\\":\\\".*")) {
      String text = extractChatText(payload);
      if (text.isBlank()) {
        return;
      }
      String chatMessage = String.format(
          "{\"type\":\"chat\",\"userId\":\"%s\",\"name\":\"%s\",\"text\":\"%s\",\"sentAt\":%d}",
          escape(user.userId()), escape(user.name()), escape(text), System.currentTimeMillis()
      );
      broadcastToRoom(user.sessionId(), session, new TextMessage(chatMessage));
      return;
    }

    broadcastToRoom(user.sessionId(), session, message);
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
    SessionUser user = sessionUsers.remove(session.getId());
    if (user != null) {
      Set<WebSocketSession> peers = roomSessions.get(user.sessionId());
      if (peers != null) {
        peers.remove(session);
        if (peers.isEmpty()) {
          roomSessions.remove(user.sessionId());
        } else {
          String leaveNotice = String.format(
              "{\"type\":\"peer-left\",\"userId\":\"%s\"}",
              escape(user.userId())
          );
          broadcastToRoom(user.sessionId(), null, new TextMessage(leaveNotice));
        }
      }
    }
  }

  @Override
  public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
    if (session.isOpen()) {
      session.close(CloseStatus.SERVER_ERROR);
    }
  }

  private void broadcastToRoom(String sessionId, WebSocketSession sender, TextMessage message) {
    Set<WebSocketSession> peers = roomSessions.get(sessionId);
    if (peers == null || peers.isEmpty()) {
      return;
    }

    for (WebSocketSession peer : peers) {
      if ((sender == null || !peer.getId().equals(sender.getId())) && peer.isOpen()) {
        try {
          synchronized (peer) {
            if (peer.isOpen()) {
              peer.sendMessage(message);
            }
          }
        } catch (IOException ignored) {}
      }
    }
  }

  private Map<String, String> parseQueryParams(URI uri) {
    Map<String, String> params = new HashMap<>();
    if (uri == null || uri.getQuery() == null) {
      return params;
    }
    String query = uri.getQuery();
    for (String param : query.split("&")) {
      String[] pair = param.split("=", 2);
      if (pair.length > 0 && !pair[0].isBlank()) {
        String key = URLDecoder.decode(pair[0], StandardCharsets.UTF_8);
        String value = pair.length > 1 ? URLDecoder.decode(pair[1], StandardCharsets.UTF_8) : "";
        params.put(key, value);
      }
    }
    return params;
  }

  private String escape(String s) {
    return s.replace("\\", "\\\\").replace("\"", "\\\"");
  }

  private String extractChatText(String payload) {
    String marker = "\"text\":\"";
    int start = payload.indexOf(marker);
    if (start < 0) {
      return "";
    }
    start += marker.length();
    int end = payload.lastIndexOf("\"}");
    if (end <= start) {
      return "";
    }
    String text = payload.substring(start, end)
        .replace("\\\"", "\"")
        .replace("\\\\", "\\")
      .trim();
    return text.substring(0, Math.min(500, text.length()));
  }
}
