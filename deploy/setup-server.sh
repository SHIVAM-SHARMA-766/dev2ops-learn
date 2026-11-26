#!/usr/bin/env bash
# Sets up (or updates) dev2ops learn on the web host. Safe to re-run.
#
#   ./deploy/setup-server.sh [ssh-target] [deploy-public-key-file]
#   defaults: ubuntu@80.225.217.150  ~/.ssh/dev2ops-learn-deploy.pub
#
# On the host it:
#   1. creates the `learn` user, whose SSH key can only rsync inside /srv/dev2ops-learn
#   2. writes /etc/caddy/sites/dev2ops-learn.caddy from deploy/Caddyfile.tmpl
#   3. reloads Caddy, if the main Caddyfile already imports /etc/caddy/sites/*.caddy
#      (the portfolio's setup writes that main file; Caddy itself is installed there)
set -euo pipefail

TARGET=${1:-ubuntu@80.225.217.150}
PUBKEY_FILE=${2:-$HOME/.ssh/dev2ops-learn-deploy.pub}
SSH_KEY=${SSH_KEY:-$HOME/.ssh/oci-n8n}
cd "$(dirname "$0")/.."

PUBKEY=$(cat "$PUBKEY_FILE")
SNIPPET=$(node -e '
  const fs = require("fs");
  const s = require("./site.config.json");
  const host = new URL(s.url).host;
  const redirects = (s.previousHosts || []).map((h) => `${h} {\n\tredir https://${host}{uri} permanent\n}\n`).join("\n");
  process.stdout.write(fs.readFileSync("deploy/Caddyfile.tmpl", "utf8").replaceAll("__HOST__", host).replace("__REDIRECTS__", redirects));
')
echo "Setting up dev2ops learn on $TARGET"

b64() { printf '%s' "$1" | base64 -w0; }
{
  echo "PUBKEY=\$(printf '%s' '$(b64 "$PUBKEY")' | base64 -d)"
  echo "SNIPPET=\$(printf '%s' '$(b64 "$SNIPPET")' | base64 -d)"
  cat <<'REMOTE'
set -euo pipefail
case "$PUBKEY" in ssh-ed25519\ *|ssh-rsa\ *|ecdsa-*) ;; *) echo "Not an SSH public key" >&2; exit 1 ;; esac
command -v caddy >/dev/null || { echo "Caddy is not installed: run the portfolio's deploy/setup-server.sh first" >&2; exit 1; }
command -v rrsync >/dev/null || apt-get install -y -qq rsync >/dev/null

# 1. deploy user: key restricted to rsync inside /srv/dev2ops-learn
id learn >/dev/null 2>&1 || useradd --create-home --shell /bin/bash learn
mkdir -p /srv/dev2ops-learn/site /home/learn/.ssh /etc/caddy/sites /var/log/caddy
echo "command=\"/usr/bin/rrsync /srv/dev2ops-learn\",restrict $PUBKEY" > /home/learn/.ssh/authorized_keys
chown -R learn:learn /home/learn/.ssh /srv/dev2ops-learn
chmod 700 /home/learn/.ssh && chmod 600 /home/learn/.ssh/authorized_keys
chmod 755 /srv/dev2ops-learn /srv/dev2ops-learn/site

# 2. Caddy site
printf '%s\n' "$SNIPPET" > /etc/caddy/sites/dev2ops-learn.caddy
chown -R caddy:caddy /var/log/caddy

# 3. reload once the main Caddyfile imports the sites folder
if grep -q '/etc/caddy/sites/' /etc/caddy/Caddyfile; then
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null
  systemctl reload caddy || systemctl restart caddy
  echo "caddy: $(systemctl is-active caddy) · serving dev2ops learn"
else
  echo "Site file written. It goes live when the main Caddyfile imports /etc/caddy/sites/ (re-run the portfolio's deploy/setup-server.sh)."
fi
REMOTE
} | ssh -i "$SSH_KEY" "$TARGET" sudo bash -s
