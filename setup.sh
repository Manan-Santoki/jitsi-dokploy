#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================="
echo " Jitsi Meet - Dokploy/CF Tunnel Setup"
echo "============================================="
echo ""

# --- .env setup ---
if [ ! -f .env ]; then
    cp env.example .env
    echo "[+] Created .env from env.example"
else
    echo "[~] .env already exists, backing up to .env.bak"
    cp .env .env.bak
fi

# --- Generate strong passwords ---
echo "[+] Generating passwords..."

PASSWORDS=(
    JICOFO_COMPONENT_SECRET
    JICOFO_AUTH_PASSWORD
    JVB_AUTH_PASSWORD
    JIGASI_XMPP_PASSWORD
    JIBRI_RECORDER_PASSWORD
    JIBRI_XMPP_PASSWORD
)

for VAR in "${PASSWORDS[@]}"; do
    NEW_PASS=$(openssl rand -hex 16)
    # Replace empty or existing value
    if grep -q "^${VAR}=" .env; then
        sed -i "s|^${VAR}=.*|${VAR}=${NEW_PASS}|" .env
    else
        echo "${VAR}=${NEW_PASS}" >> .env
    fi
done

echo "[+] Passwords generated and written to .env"

# --- Auto-detect public IP if not set ---
CURRENT_IP=$(grep '^JVB_ADVERTISE_IPS=' .env | cut -d'=' -f2)
if [ "$CURRENT_IP" = "YOUR_SERVER_PUBLIC_IP" ] || [ -z "$CURRENT_IP" ]; then
    echo ""
    echo "[*] Detecting public IP..."
    PUBLIC_IP=$(curl -s -4 ifconfig.me || curl -s -4 icanhazip.com || echo "")
    if [ -n "$PUBLIC_IP" ]; then
        echo "    Detected: $PUBLIC_IP"
        read -p "    Use this IP for JVB_ADVERTISE_IPS? [Y/n] " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            sed -i "s|^JVB_ADVERTISE_IPS=.*|JVB_ADVERTISE_IPS=${PUBLIC_IP}|" .env
            echo "[+] Set JVB_ADVERTISE_IPS=${PUBLIC_IP}"
        fi
    else
        echo "    [!] Could not detect public IP. Set JVB_ADVERTISE_IPS manually in .env"
    fi
fi

# --- Create config directories ---
echo "[+] Creating config directories..."
CONFIG_DIR=$(grep '^CONFIG=' .env | cut -d'=' -f2)
CONFIG_DIR="${CONFIG_DIR/#\~/$HOME}"

mkdir -p "${CONFIG_DIR}"/{web,transcripts,prosody/config,prosody/prosody-plugins-custom,jicofo,jvb,jigasi,jibri}
echo "    Created: ${CONFIG_DIR}/*"

# --- Check domain ---
DOMAIN=$(grep '^JITSI_DOMAIN=' .env | cut -d'=' -f2)
if [ "$DOMAIN" = "meet.yourdomain.com" ]; then
    echo ""
    echo "[!] WARNING: You still need to set JITSI_DOMAIN in .env"
    echo "    Edit .env and set it to your actual domain."
fi

echo ""
echo "============================================="
echo " Setup complete!"
echo "============================================="
echo ""
echo " Next steps:"
echo "  1. Edit .env → set JITSI_DOMAIN to your domain"
echo "  2. Ensure JVB_ADVERTISE_IPS is your server's public IP"
echo "  3. Open UDP port 10000 on your firewall:"
echo "       ufw allow 10000/udp"
echo "       # or: iptables -A INPUT -p udp --dport 10000 -j ACCEPT"
echo "  4. Add a Cloudflare Tunnel public hostname:"
echo "       Hostname: meet.yourdomain.com"
echo "       Service:  http://localhost:8000  (or whatever HTTP_PORT is)"
echo "       # If using dokploy-network, point to http://jitsi-dokploy-web-1:80"
echo "  5. Run: docker compose up -d"
echo "  6. Visit: https://${DOMAIN}"
echo ""
