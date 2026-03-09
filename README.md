# Jitsi Meet — Dokploy + Cloudflare Tunnel

Self-hosted Jitsi Meet configured for a Dokploy (Traefik) + Cloudflare Tunnel setup on Hetzner.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Clients                                                │
│                                                         │
│   HTTPS (web/signaling)          UDP (audio/video)      │
│         │                              │                │
│         ▼                              ▼                │
│  ┌──────────────┐              ┌──────────────┐         │
│  │  Cloudflare  │              │  Direct to   │         │
│  │   Tunnel     │              │  Server IP   │         │
│  └──────┬───────┘              │  :10000/udp  │         │
│         │                      └──────┬───────┘         │
└─────────┼─────────────────────────────┼─────────────────┘
          │                             │
┌─────────┼─────────────────────────────┼─────────────────┐
│ Hetzner │Server                       │                 │
│         ▼                             │                 │
│  ┌──────────────┐                     │                 │
│  │   Traefik    │                     │                 │
│  │  (Dokploy)   │                     │                 │
│  └──────┬───────┘                     │                 │
│         │ HTTP                        │                 │
│         ▼                             ▼                 │
│  ┌────────────┐  ┌──────────┐  ┌───────────┐           │
│  │  jitsi/web │──│ prosody  │──│    JVB    │           │
│  │  (nginx)   │  │ (XMPP)  │  │ (media)   │           │
│  └────────────┘  └──────────┘  └───────────┘           │
│                  ┌──────────┐                           │
│                  │  jicofo  │                           │
│                  │ (focus)  │                           │
│                  └──────────┘                           │
└─────────────────────────────────────────────────────────┘
```

**Key insight:** Cloudflare Tunnel only handles HTTP/HTTPS. WebRTC media (audio/video) uses UDP and must go directly to your server's public IP on port 10000. This is unavoidable — there's no way to tunnel UDP through Cloudflare Tunnel.

## Quick Start

```bash
# 1. Clone and setup
git clone <your-repo-url> && cd jitsi-dokploy
chmod +x setup.sh
./setup.sh

# 2. Edit .env
#    - Set JITSI_DOMAIN=meet.yourdomain.com
#    - Verify JVB_ADVERTISE_IPS is your public IP

# 3. Open firewall for JVB media
sudo ufw allow 10000/udp

# 4. Configure Cloudflare Tunnel
#    In Cloudflare Zero Trust dashboard → Tunnels → your tunnel:
#    Add public hostname:
#      Subdomain: meet
#      Domain:    yourdomain.com
#      Service:   http://jitsi-dokploy-web-1:80
#    (or http://localhost:8000 if not on dokploy-network)

# 5. Launch
docker compose up -d

# 6. Visit https://meet.yourdomain.com
```

## Cloudflare Tunnel Config

In your Cloudflare Tunnel config (either dashboard or `config.yml`), add:

```yaml
# If using config.yml for cloudflared
ingress:
  - hostname: meet.yourdomain.com
    service: http://jitsi-dokploy-web-1:80
    # Or if tunnel container is on the same docker network
```

If you manage the tunnel via dashboard, just add the hostname pointing to the web container.

### WebSocket Support

Cloudflare Tunnel supports WebSockets natively, so `/xmpp-websocket` and `/colibri-ws` will work through the tunnel without extra config.

## Firewall

You **must** open UDP 10000 on your server. Without it, calls will fail when >2 participants join:

```bash
# UFW
sudo ufw allow 10000/udp

# iptables
sudo iptables -A INPUT -p udp --dport 10000 -j ACCEPT

# Hetzner firewall (if using): add rule in Hetzner Cloud console
```

## Authentication

To enable authentication:

1. Set in `.env`:
   ```
   ENABLE_AUTH=1
   AUTH_TYPE=internal
   ENABLE_GUESTS=1
   ```

2. Restart: `docker compose up -d`

3. Create a user:
   ```bash
   docker compose exec prosody prosodyctl \
     --config /config/prosody.cfg.lua \
     register <username> meet.jitsi <password>
   ```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Calls fail with >2 users | JVB can't receive UDP | Open port 10000/udp, check `JVB_ADVERTISE_IPS` |
| Mic/camera errors | HTTP instead of HTTPS | Ensure accessing via `https://` through CF Tunnel |
| Can't connect at all | CF Tunnel not routing | Check tunnel hostname points to web container |
| Infinite loading | WebSocket blocked | Verify CF Tunnel is forwarding `/xmpp-websocket` |
| "location not found" | Traefik misconfigured | Check `dokploy-network` exists and web container is on it |

### Check JVB connectivity
```bash
# From outside your server, test UDP port
nc -zuv YOUR_SERVER_IP 10000

# Check JVB logs
docker compose logs -f jvb
```

## Dokploy Network Note

The `docker-compose.yml` expects a `dokploy-network` external network. If your Dokploy/Traefik uses a different network name, update the `networks` section. Check with:

```bash
docker network ls | grep dokploy
```
